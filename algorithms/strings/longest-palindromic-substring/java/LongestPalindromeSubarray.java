public class LongestPalindromeSubarray {

    public static int longestPalindromeSubarray(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;

        int maxLen = 1;
        for (int i = 0; i < n; i++) {
            int odd = expand(arr, i, i);
            int even = expand(arr, i, i + 1);
            maxLen = Math.max(maxLen, Math.max(odd, even));
        }
        return maxLen;
    }

    private static int expand(int[] arr, int l, int r) {
        while (l >= 0 && r < arr.length && arr[l] == arr[r]) {
            l--;
            r++;
        }
        return r - l - 1;
    }
}
