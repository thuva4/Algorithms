public class SequenceAlignment {

    static final int GAP_COST = 4;
    static final int MISMATCH_COST = 3;

    public static int sequenceAlignment(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i * GAP_COST;
        for (int j = 0; j <= n; j++) dp[0][j] = j * GAP_COST;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                int matchCost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : MISMATCH_COST;
                dp[i][j] = Math.min(
                    Math.min(dp[i - 1][j] + GAP_COST, dp[i][j - 1] + GAP_COST),
                    dp[i - 1][j - 1] + matchCost
                );
            }
        }

        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println(sequenceAlignment("GCCCTAGCG", "GCGCAATG")); // 18
    }
}
