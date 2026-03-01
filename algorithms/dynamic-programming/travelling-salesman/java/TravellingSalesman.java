import java.util.Arrays;

public class TravellingSalesman {
    public static int travellingSalesman(int[] arr) {
        int n = arr[0];
        if (n <= 1) return 0;
        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i][j] = arr[1 + i * n + j];

        int INF = Integer.MAX_VALUE / 2;
        int[][] dp = new int[1 << n][n];
        for (int[] row : dp) Arrays.fill(row, INF);
        dp[1][0] = 0;

        int full = (1 << n) - 1;
        for (int mask = 1; mask <= full; mask++)
            for (int i = 0; i < n; i++) {
                if (dp[mask][i] >= INF || (mask & (1 << i)) == 0) continue;
                for (int j = 0; j < n; j++) {
                    if ((mask & (1 << j)) != 0) continue;
                    int nm = mask | (1 << j);
                    int cost = dp[mask][i] + dist[i][j];
                    if (cost < dp[nm][j]) dp[nm][j] = cost;
                }
            }

        int result = INF;
        for (int i = 0; i < n; i++)
            result = Math.min(result, dp[full][i] + dist[i][0]);
        return result;
    }
}
