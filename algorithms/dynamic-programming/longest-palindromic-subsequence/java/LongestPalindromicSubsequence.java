public class LongestPalindromicSubsequence {

    public static int longestPalindromicSubsequence(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;
        int[][] dp = new int[n][n];
        for (int i = 0; i < n; i++) dp[i][i] = 1;
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (arr[i] == arr[j]) dp[i][j] = (len == 2) ? 2 : dp[i + 1][j - 1] + 2;
                else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
        return dp[0][n - 1];
    }
}
