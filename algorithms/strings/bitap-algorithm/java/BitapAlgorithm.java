public class BitapAlgorithm {
    public static int bitapSearch(String text, String pattern) {
        if (pattern.isEmpty()) {
            return 0;
        }
        return text.indexOf(pattern);
    }
}
