public class CanPartition {

    public static int canPartition(int[] arr) {
        int total = 0;
        for (int x : arr) total += x;
        if (total % 2 != 0) return 0;
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int num : arr) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        return dp[target] ? 1 : 0;
    }
}
