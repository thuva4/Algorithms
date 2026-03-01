package com.algorithms;

import org.yaml.snakeyaml.Yaml;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Java test runner that reads cases.yaml and tests Java implementations.
 *
 * Usage:
 *   # Via Maven:
 *   cd tests/runners/java
 *   mvn compile exec:java -Dexec.args="sorting/bubble-sort"   # Run one algorithm
 *   mvn compile exec:java                                      # Run all
 *
 *   # Via shell script wrapper:
 *   bash tests/runners/java_runner.sh sorting/bubble-sort
 */
public class TestRunner {

    private static Path repoRoot;
    private static Path algorithmsDir;

    private static int passed = 0;
    private static int failed = 0;
    private static int skipped = 0;
    private static final List<String> errors = new ArrayList<>();

    public static void main(String[] args) {
        // Determine repo root: walk up from this file's location to find "algorithms" dir
        repoRoot = findRepoRoot();
        algorithmsDir = repoRoot.resolve("algorithms");

        if (!Files.isDirectory(algorithmsDir)) {
            System.err.println("ERROR: Cannot find algorithms directory at: " + algorithmsDir);
            System.exit(1);
        }

        String algorithmPath = args.length > 0 ? args[0] : null;

        List<Path> algoDirs;
        if (algorithmPath != null) {
            algoDirs = List.of(algorithmsDir.resolve(algorithmPath));
        } else {
            algoDirs = discoverAlgorithms();
        }

        for (Path algoDir : algoDirs) {
            processAlgorithm(algoDir);
        }

        printReport();
        System.exit(failed > 0 ? 1 : 0);
    }

    /**
     * Find the repo root by looking for the "algorithms" directory.
     * Tries several strategies.
     */
    private static Path findRepoRoot() {
        // Strategy 1: Check if CWD or parent contains "algorithms"
        Path cwd = Paths.get(System.getProperty("user.dir")).toAbsolutePath();

        // If we're in tests/runners/java, go up 3 levels
        Path candidate = cwd;
        for (int i = 0; i < 5; i++) {
            if (Files.isDirectory(candidate.resolve("algorithms"))) {
                return candidate;
            }
            candidate = candidate.getParent();
            if (candidate == null) break;
        }

        // Strategy 2: Use the class location
        try {
            Path classPath = Paths.get(
                TestRunner.class.getProtectionDomain().getCodeSource().getLocation().toURI()
            );
            candidate = classPath;
            for (int i = 0; i < 8; i++) {
                if (Files.isDirectory(candidate.resolve("algorithms"))) {
                    return candidate;
                }
                candidate = candidate.getParent();
                if (candidate == null) break;
            }
        } catch (Exception ignored) {
        }

        // Fallback: assume CWD is repo root
        return cwd;
    }

    /**
     * Discover all algorithm directories that have tests/cases.yaml.
     */
    private static List<Path> discoverAlgorithms() {
        List<Path> result = new ArrayList<>();
        try (Stream<Path> stream = Files.walk(algorithmsDir, 4)) {
            stream.filter(p -> p.endsWith("tests/cases.yaml"))
                  .map(p -> p.getParent().getParent()) // go from tests/cases.yaml -> algo dir
                  .sorted()
                  .forEach(result::add);
        } catch (IOException e) {
            System.err.println("ERROR: Failed to scan algorithms directory: " + e.getMessage());
        }
        return result;
    }

    /**
     * Process a single algorithm: load test cases, compile Java, run tests.
     */
    @SuppressWarnings("unchecked")
    private static void processAlgorithm(Path algoDir) {
        Path casesPath = algoDir.resolve("tests").resolve("cases.yaml");
        Path javaDir = algoDir.resolve("java");
        String algoName = algoDir.getParent().getFileName() + "/" + algoDir.getFileName();

        if (!Files.exists(casesPath)) {
            return;
        }

        if (!Files.isDirectory(javaDir)) {
            skipped++;
            return;
        }

        // Find Java source files
        List<Path> javaFiles = findJavaFiles(javaDir);
        if (javaFiles.isEmpty()) {
            skipped++;
            return;
        }

        // Load test cases
        Map<String, Object> testData;
        try (FileInputStream fis = new FileInputStream(casesPath.toFile())) {
            Yaml yaml = new Yaml();
            testData = yaml.load(fis);
        } catch (Exception e) {
            errors.add(algoName + ": Failed to load cases.yaml: " + e.getMessage());
            failed++;
            return;
        }

        Map<String, Object> funcSig = (Map<String, Object>) testData.get("function_signature");
        String yamlFuncName = (String) funcSig.get("name");
        String camelName = snakeToCamel(yamlFuncName);
        List<Map<String, Object>> testCases = (List<Map<String, Object>>) testData.get("test_cases");

        // Compile Java files
        Path tempDir;
        try {
            tempDir = Files.createTempDirectory("java-test-runner-");
        } catch (IOException e) {
            errors.add(algoName + ": Failed to create temp directory: " + e.getMessage());
            failed++;
            return;
        }

        try {
            if (!compileJavaFiles(javaFiles, tempDir)) {
                errors.add(algoName + ": Compilation failed");
                failed++;
                return;
            }

            // Load compiled classes and find the target method
            URLClassLoader classLoader = new URLClassLoader(
                new URL[]{tempDir.toUri().toURL()},
                TestRunner.class.getClassLoader()
            );

            MethodMatch match = findTargetMethod(javaFiles, classLoader, camelName, yamlFuncName, testCases);
            if (match == null) {
                errors.add(algoName + ": Could not find method '" + camelName + "' (or '" + yamlFuncName + "') in any Java file");
                skipped++;
                return;
            }

            // Run test cases
            for (Map<String, Object> testCase : testCases) {
                String caseName = (String) testCase.get("name");
                List<Object> rawInputs = (List<Object>) testCase.get("input");
                Object expectedRaw = testCase.get("expected");

                try {
                    Object[] methodArgs = convertInputs(rawInputs, match.method);
                    Object result = match.method.invoke(null, methodArgs);

                    // For void methods (in-place sort), the result is the mutated first array arg
                    if (match.method.getReturnType() == void.class) {
                        result = methodArgs[0];
                    }

                    // Compare
                    if (compareResults(result, expectedRaw)) {
                        passed++;
                    } else {
                        failed++;
                        errors.add(algoName + " - " + caseName + ": expected "
                            + formatValue(expectedRaw) + ", got " + formatValue(result));
                    }
                } catch (Exception e) {
                    failed++;
                    String errMsg = e.getCause() != null ? e.getCause().toString() : e.toString();
                    errors.add(algoName + " - " + caseName + ": " + errMsg);
                }
            }

            classLoader.close();
        } catch (Exception e) {
            errors.add(algoName + ": " + e.getMessage());
            failed++;
        } finally {
            // Cleanup temp dir
            deleteRecursive(tempDir.toFile());
        }
    }

    /**
     * Find all .java files in a directory.
     */
    private static List<Path> findJavaFiles(Path dir) {
        List<Path> result = new ArrayList<>();
        try (Stream<Path> stream = Files.list(dir)) {
            stream.filter(p -> p.toString().endsWith(".java"))
                  .forEach(result::add);
        } catch (IOException ignored) {
        }
        return result;
    }

    /**
     * Compile Java source files into a temp directory.
     */
    private static boolean compileJavaFiles(List<Path> javaFiles, Path outputDir) {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            System.err.println("ERROR: No Java compiler available. Ensure you are running with a JDK, not a JRE.");
            return false;
        }

        List<String> compilerArgs = new ArrayList<>();
        compilerArgs.add("-d");
        compilerArgs.add(outputDir.toString());
        compilerArgs.add("-source");
        compilerArgs.add("17");
        compilerArgs.add("-target");
        compilerArgs.add("17");
        compilerArgs.add("-nowarn");

        // Add all Java files from the directory as source path for cross-references
        for (Path jf : javaFiles) {
            compilerArgs.add(jf.toString());
        }

        // Suppress compiler output by redirecting stderr
        int result = compiler.run(null, null, null, compilerArgs.toArray(new String[0]));
        return result == 0;
    }

    /**
     * Record for a matched method and its class.
     */
    private static class MethodMatch {
        final Class<?> clazz;
        final Method method;

        MethodMatch(Class<?> clazz, Method method) {
            this.clazz = clazz;
            this.method = method;
        }
    }

    /**
     * Find the target static method in the compiled classes.
     * Tries multiple name variations and signature matching strategies.
     */
    @SuppressWarnings("unchecked")
    private static MethodMatch findTargetMethod(
            List<Path> javaFiles, URLClassLoader classLoader,
            String camelName, String yamlFuncName,
            List<Map<String, Object>> testCases) {

        // Determine expected parameter count from test cases
        int expectedParamCount = -1;
        if (!testCases.isEmpty()) {
            List<Object> firstInput = (List<Object>) testCases.get(0).get("input");
            expectedParamCount = firstInput.size();
        }

        // Names to try (in order of preference)
        List<String> namesToTry = new ArrayList<>();
        namesToTry.add(camelName);              // e.g. "bubbleSort"
        namesToTry.add(yamlFuncName);           // e.g. "bubble_sort"
        namesToTry.add("sort");                 // common for sorting algorithms
        namesToTry.add("search");               // common for search algorithms

        for (Path javaFile : javaFiles) {
            String className = javaFile.getFileName().toString().replace(".java", "");
            try {
                Class<?> clazz = classLoader.loadClass(className);

                for (String methodName : namesToTry) {
                    // Find all public/package-private static methods with this name
                    for (Method method : clazz.getDeclaredMethods()) {
                        if (!method.getName().equals(methodName)) continue;
                        if (!Modifier.isStatic(method.getModifiers())) continue;

                        // Make accessible (for package-private or private methods)
                        method.setAccessible(true);

                        int paramCount = method.getParameterCount();

                        // Exact parameter count match
                        if (paramCount == expectedParamCount) {
                            return new MethodMatch(clazz, method);
                        }

                        // For void in-place methods: they take the array only (1 param)
                        // but YAML input also has 1 element (the array), so it matches
                    }
                }

                // If no name match, try ANY static method with the right param count
                // (excluding main)
                for (Method method : clazz.getDeclaredMethods()) {
                    if (!Modifier.isStatic(method.getModifiers())) continue;
                    if (method.getName().equals("main")) continue;

                    method.setAccessible(true);
                    if (method.getParameterCount() == expectedParamCount) {
                        return new MethodMatch(clazz, method);
                    }
                }
            } catch (ClassNotFoundException ignored) {
            }
        }

        return null;
    }

    /**
     * Convert YAML input values to Java method parameter types.
     */
    private static Object[] convertInputs(List<Object> rawInputs, Method method) {
        Class<?>[] paramTypes = method.getParameterTypes();
        Object[] result = new Object[paramTypes.length];

        for (int i = 0; i < paramTypes.length; i++) {
            Object raw = i < rawInputs.size() ? rawInputs.get(i) : null;
            result[i] = convertValue(raw, paramTypes[i]);
        }

        return result;
    }

    /**
     * Convert a single YAML value to the expected Java type.
     */
    @SuppressWarnings("unchecked")
    private static Object convertValue(Object raw, Class<?> targetType) {
        if (raw == null) return null;

        // int[] from List<Integer>
        if (targetType == int[].class && raw instanceof List) {
            List<Object> list = (List<Object>) raw;
            int[] arr = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                arr[i] = ((Number) list.get(i)).intValue();
            }
            return arr;
        }

        // int or Integer
        if ((targetType == int.class || targetType == Integer.class) && raw instanceof Number) {
            return ((Number) raw).intValue();
        }

        // long or Long
        if ((targetType == long.class || targetType == Long.class) && raw instanceof Number) {
            return ((Number) raw).longValue();
        }

        // double or Double
        if ((targetType == double.class || targetType == Double.class) && raw instanceof Number) {
            return ((Number) raw).doubleValue();
        }

        // String
        if (targetType == String.class) {
            return raw.toString();
        }

        // boolean
        if ((targetType == boolean.class || targetType == Boolean.class) && raw instanceof Boolean) {
            return raw;
        }

        // double[] from List
        if (targetType == double[].class && raw instanceof List) {
            List<Object> list = (List<Object>) raw;
            double[] arr = new double[list.size()];
            for (int i = 0; i < list.size(); i++) {
                arr[i] = ((Number) list.get(i)).doubleValue();
            }
            return arr;
        }

        // String[] from List
        if (targetType == String[].class && raw instanceof List) {
            List<Object> list = (List<Object>) raw;
            String[] arr = new String[list.size()];
            for (int i = 0; i < list.size(); i++) {
                arr[i] = list.get(i).toString();
            }
            return arr;
        }

        // List passthrough
        if (List.class.isAssignableFrom(targetType) && raw instanceof List) {
            return raw;
        }

        // Fallback: return as-is
        return raw;
    }

    /**
     * Compare actual result with expected value from YAML.
     */
    @SuppressWarnings("unchecked")
    private static boolean compareResults(Object actual, Object expected) {
        if (actual == null && expected == null) return true;
        if (actual == null || expected == null) return false;

        // int[] vs List<Integer>
        if (actual instanceof int[] && expected instanceof List) {
            int[] arr = (int[]) actual;
            List<Object> list = (List<Object>) expected;
            if (arr.length != list.size()) return false;
            for (int i = 0; i < arr.length; i++) {
                if (arr[i] != ((Number) list.get(i)).intValue()) return false;
            }
            return true;
        }

        // double[] vs List
        if (actual instanceof double[] && expected instanceof List) {
            double[] arr = (double[]) actual;
            List<Object> list = (List<Object>) expected;
            if (arr.length != list.size()) return false;
            for (int i = 0; i < arr.length; i++) {
                if (Math.abs(arr[i] - ((Number) list.get(i)).doubleValue()) > 1e-9) return false;
            }
            return true;
        }

        // Number comparison
        if (actual instanceof Number && expected instanceof Number) {
            // Compare as long first (handles int/long), then as double
            if (actual instanceof Double || actual instanceof Float
                || expected instanceof Double || expected instanceof Float) {
                return Math.abs(((Number) actual).doubleValue()
                    - ((Number) expected).doubleValue()) < 1e-9;
            }
            return ((Number) actual).longValue() == ((Number) expected).longValue();
        }

        // String comparison
        if (actual instanceof String && expected instanceof String) {
            return actual.equals(expected);
        }

        // Boolean comparison
        if (actual instanceof Boolean && expected instanceof Boolean) {
            return actual.equals(expected);
        }

        // List vs List
        if (actual instanceof List && expected instanceof List) {
            List<Object> actualList = (List<Object>) actual;
            List<Object> expectedList = (List<Object>) expected;
            if (actualList.size() != expectedList.size()) return false;
            for (int i = 0; i < actualList.size(); i++) {
                if (!compareResults(actualList.get(i), expectedList.get(i))) return false;
            }
            return true;
        }

        // Fallback
        return actual.equals(expected);
    }

    /**
     * Convert snake_case to camelCase.
     */
    private static String snakeToCamel(String s) {
        StringBuilder result = new StringBuilder();
        boolean capitalizeNext = false;
        for (char c : s.toCharArray()) {
            if (c == '_') {
                capitalizeNext = true;
            } else {
                if (capitalizeNext) {
                    result.append(Character.toUpperCase(c));
                    capitalizeNext = false;
                } else {
                    result.append(c);
                }
            }
        }
        return result.toString();
    }

    /**
     * Format a value for display in error messages.
     */
    private static String formatValue(Object value) {
        if (value instanceof int[]) {
            return Arrays.toString((int[]) value);
        }
        if (value instanceof double[]) {
            return Arrays.toString((double[]) value);
        }
        if (value instanceof Object[]) {
            return Arrays.toString((Object[]) value);
        }
        if (value instanceof List) {
            return value.toString();
        }
        return String.valueOf(value);
    }

    /**
     * Print the final test results report.
     */
    private static void printReport() {
        int total = passed + failed + skipped;
        System.out.println();
        System.out.println("============================================================");
        System.out.println("Java Test Results");
        System.out.println("============================================================");
        System.out.println("  Passed:  " + passed);
        System.out.println("  Failed:  " + failed);
        System.out.println("  Skipped: " + skipped + " (no Java implementation or method not found)");
        System.out.println("  Total:   " + total);

        if (!errors.isEmpty()) {
            System.out.println();
            System.out.println("Failures:");
            for (String err : errors) {
                System.out.println("  x " + err);
            }
        }

        System.out.println();
    }

    /**
     * Recursively delete a directory.
     */
    private static void deleteRecursive(File file) {
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    deleteRecursive(child);
                }
            }
        }
        file.delete();
    }
}
