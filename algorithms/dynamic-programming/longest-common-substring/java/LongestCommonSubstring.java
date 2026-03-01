public class LongestCommonSubstring {

    /**
     * Find the length of the longest contiguous subarray common to both arrays.
     *
     * @param arr1 first array of integers
     * @param arr2 second array of integers
     * @return length of the longest common contiguous subarray
     */
    public static int longestCommonSubstring(int[] arr1, int[] arr2) {
        int n = arr1.length;
        int m = arr2.length;
        int maxLen = 0;

        int[][] dp = new int[n + 1][m + 1];

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (arr1[i - 1] == arr2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > maxLen) {
                        maxLen = dp[i][j];
                    }
                } else {
                    dp[i][j] = 0;
                }
            }
        }

        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(longestCommonSubstring(
            new int[]{1, 2, 3, 4, 5}, new int[]{3, 4, 5, 6, 7}));  // 3
        System.out.println(longestCommonSubstring(
            new int[]{1, 2, 3}, new int[]{4, 5, 6}));                // 0
        System.out.println(longestCommonSubstring(
            new int[]{1, 2, 3, 4}, new int[]{1, 2, 3, 4}));          // 4
        System.out.println(longestCommonSubstring(
            new int[]{1}, new int[]{1}));                             // 1
        System.out.println(longestCommonSubstring(
            new int[]{1, 2, 3, 2, 1}, new int[]{3, 2, 1, 4, 7}));   // 3
    }
}
