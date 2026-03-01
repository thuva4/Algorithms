import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const REPO_ROOT = resolve(import.meta.dirname, '..', '..', '..');
const ALGORITHMS_DIR = join(REPO_ROOT, 'algorithms');
const FILTERED_ALGORITHM = process.env.ALGORITHM_PATH?.trim();
const require = createRequire(import.meta.url);
const fsModule = require('fs') as typeof import('fs');
const readlineModule = require('readline') as typeof import('readline');
const DUMMY_STDIN_INPUT = '0 '.repeat(256).trim();

// Convert snake_case to camelCase
function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

interface TestCase {
  name: string;
  input: unknown[];
  expected: unknown;
}

interface TestData {
  algorithm: string;
  function_signature: {
    name: string;
    input: string[] | string;
    output: string;
  };
  test_cases: TestCase[];
}

function normalizeSpecialScalars<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSpecialScalars(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
        key,
        normalizeSpecialScalars(entryValue),
      ]),
    ) as T;
  }

  if (value === 'Infinity') {
    return Infinity as T;
  }

  if (value === '-Infinity') {
    return -Infinity as T;
  }

  return value;
}

function normalizeInputArgs(input: unknown, signatureInput: string[] | string): unknown[] {
  if (Array.isArray(input)) {
    if (Array.isArray(signatureInput) && signatureInput.length === 1) {
      const [descriptor] = signatureInput;
      const expectsCollection = /array|list|matrix|graph|adjacency|queries|operations|edges|data/i.test(descriptor);
      const alreadyWrapped = input.length === 1 && (Array.isArray(input[0]) || (input[0] !== null && typeof input[0] === 'object'));

      if (expectsCollection && !alreadyWrapped) {
        return [input];
      }
    }

    return input;
  }

  if (input && typeof input === 'object') {
    return Object.values(input as Record<string, unknown>);
  }

  return [input];
}

function normalizeIdentifier(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function findExportedFunction(
  mod: Record<string, unknown>,
  exactNames: string[],
): ((...args: unknown[]) => unknown) | null {
  const sources: Record<string, unknown>[] = [mod];

  if (mod.default && typeof mod.default === 'object') {
    sources.push(mod.default as Record<string, unknown>);
  }

  for (const source of sources) {
    for (const name of exactNames) {
      const candidate = source[name];
      if (typeof candidate === 'function') {
        return candidate as (...args: unknown[]) => unknown;
      }
    }
  }

  const normalizedNames = new Set(exactNames.map(normalizeIdentifier));
  for (const source of sources) {
    for (const [exportName, candidate] of Object.entries(source)) {
      if (typeof candidate !== 'function') {
        continue;
      }

      if (normalizedNames.has(normalizeIdentifier(exportName))) {
        return candidate as (...args: unknown[]) => unknown;
      }
    }
  }

  if (typeof mod.default === 'function') {
    return mod.default as (...args: unknown[]) => unknown;
  }

  return null;
}

function findTypescriptImplementationFile(algoPath: string): string | null {
  const tsDir = join(algoPath, 'typescript');
  if (!existsSync(tsDir)) {
    return null;
  }

  const sourceFile = readdirSync(tsDir)
    .filter((file) => /\.(?:[cm]?ts|[cm]?js)$/.test(file))
    .filter((file) => !/\.test\./.test(file))
    .filter((file) => !/\.spec\./.test(file))
    .sort()[0];

  return sourceFile ? join(tsDir, sourceFile) : null;
}

async function importImplementation(moduleUrl: string) {
  const originalReadFileSync = fsModule.readFileSync;
  const originalCreateInterface = readlineModule.createInterface;
  const originalConsoleLog = console.log;

  fsModule.readFileSync = ((path: Parameters<typeof originalReadFileSync>[0], ...args: unknown[]) => {
    if (path === '/dev/stdin') {
      return DUMMY_STDIN_INPUT;
    }

    return originalReadFileSync(path, ...(args as []));
  }) as typeof fsModule.readFileSync;

  readlineModule.createInterface = ((..._args: Parameters<typeof originalCreateInterface>) => {
    const fakeInterface = {
      on: () => fakeInterface,
      close: () => undefined,
    };

    return fakeInterface as ReturnType<typeof originalCreateInterface>;
  }) as typeof readlineModule.createInterface;

  console.log = () => undefined;

  try {
    return await import(moduleUrl);
  } finally {
    fsModule.readFileSync = originalReadFileSync;
    readlineModule.createInterface = originalCreateInterface;
    console.log = originalConsoleLog;
  }
}

// Discover all algorithms with test cases AND TypeScript implementations
function discoverAlgorithms(): { algoPath: string; category: string; slug: string; implementationPath: string }[] {
  const results: { algoPath: string; category: string; slug: string; implementationPath: string }[] = [];
  const categories = readdirSync(ALGORITHMS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const cat of categories) {
    const catPath = join(ALGORITHMS_DIR, cat.name);
    const algorithms = readdirSync(catPath, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const algo of algorithms) {
      const algoPath = join(catPath, algo.name);
      const hasCases = existsSync(join(algoPath, 'tests', 'cases.yaml'));
      const hasTs = existsSync(join(algoPath, 'typescript'));
      const relativeAlgorithmPath = `${cat.name}/${algo.name}`;

      if (FILTERED_ALGORITHM && FILTERED_ALGORITHM !== relativeAlgorithmPath) {
        continue;
      }

      const implementationPath = hasTs ? findTypescriptImplementationFile(algoPath) : null;

      if (hasCases && implementationPath) {
        results.push({ algoPath, category: cat.name, slug: algo.name, implementationPath });
      }
    }
  }
  return results;
}

const algorithms = discoverAlgorithms();

for (const { algoPath, category, slug, implementationPath } of algorithms) {
  describe(`${category}/${slug}`, () => {
    const casesPath = join(algoPath, 'tests', 'cases.yaml');
    const testData: TestData = normalizeSpecialScalars(parseYaml(readFileSync(casesPath, 'utf-8')));
    const funcName = snakeToCamel(testData.function_signature.name);

    for (const testCase of testData.test_cases) {
      it(testCase.name, async () => {
        const moduleUrl = pathToFileURL(implementationPath).href;
        const mod = await importImplementation(moduleUrl);

        const fn = findExportedFunction(mod, [funcName, testData.function_signature.name]);
        if (!fn) {
          throw new Error(`Function '${funcName}' not found in ${implementationPath}. Exports: ${Object.keys(mod).join(', ')}`);
        }

        const inputArgs = normalizeInputArgs(testCase.input, testData.function_signature.input);
        const result = Reflect.apply(fn, undefined, inputArgs);
        expect(result).toEqual(testCase.expected);
      });
    }
  });
}
