import java.util.Arrays;
import java.util.Scanner;

public class BitmaskDp {
    public static int bitmaskDp(int n, int[][] cost) {
        int total = 1 << n;
        int[] dp = new int[total];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;

        for (int mask = 0; mask < total; mask++) {
            if (dp[mask] == Integer.MAX_VALUE) continue;
            int worker = Integer.bitCount(mask);
            if (worker >= n) continue;
            for (int job = 0; job < n; job++) {
                if ((mask & (1 << job)) == 0) {
                    int newMask = mask | (1 << job);
                    dp[newMask] = Math.min(dp[newMask], dp[mask] + cost[worker][job]);
                }
            }
        }

        return dp[total - 1];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] cost = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                cost[i][j] = sc.nextInt();
        System.out.println(bitmaskDp(n, cost));
    }
}
