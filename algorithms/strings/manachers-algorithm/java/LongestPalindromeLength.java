public class LongestPalindromeLength {

    public static int longestPalindromeLength(int[] arr) {
        if (arr.length == 0) return 0;

        int[] t = new int[2 * arr.length + 1];
        for (int i = 0; i < t.length; i++) {
            t[i] = (i % 2 == 0) ? -1 : arr[i / 2];
        }

        int n = t.length;
        int[] p = new int[n];
        int c = 0, r = 0, maxLen = 0;

        for (int i = 0; i < n; i++) {
            int mirror = 2 * c - i;
            if (i < r) {
                p[i] = Math.min(r - i, p[mirror]);
            }
            while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] == t[i - p[i] - 1]) {
                p[i]++;
            }
            if (i + p[i] > r) {
                c = i;
                r = i + p[i];
            }
            if (p[i] > maxLen) maxLen = p[i];
        }

        return maxLen;
    }
}
