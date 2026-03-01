public class LevenshteinDistance {

    /**
     * Compute the Levenshtein (edit) distance between two sequences.
     *
     * Input format: [len1, seq1..., len2, seq2...]
     * @param arr input array encoding two sequences
     * @return minimum number of single-element edits
     */
    public static int levenshteinDistance(int[] arr) {
        int idx = 0;
        int len1 = arr[idx++];
        int[] seq1 = new int[len1];
        for (int i = 0; i < len1; i++) seq1[i] = arr[idx++];
        int len2 = arr[idx++];
        int[] seq2 = new int[len2];
        for (int i = 0; i < len2; i++) seq2[i] = arr[idx++];

        int[][] dp = new int[len1 + 1][len2 + 1];

        for (int i = 0; i <= len1; i++) dp[i][0] = i;
        for (int j = 0; j <= len2; j++) dp[0][j] = j;

        for (int i = 1; i <= len1; i++) {
            for (int j = 1; j <= len2; j++) {
                if (seq1[i - 1] == seq2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j],
                                   Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
                }
            }
        }

        return dp[len1][len2];
    }

    public static void main(String[] args) {
        System.out.println(levenshteinDistance(new int[]{3, 1, 2, 3, 3, 1, 2, 4})); // 1
        System.out.println(levenshteinDistance(new int[]{2, 5, 6, 2, 5, 6}));       // 0
        System.out.println(levenshteinDistance(new int[]{2, 1, 2, 2, 3, 4}));       // 2
        System.out.println(levenshteinDistance(new int[]{0, 3, 1, 2, 3}));          // 3
    }
}
