using System;

public class TravellingSalesman
{
    public static int Run(int[] arr)
    {
        int n = arr[0];
        if (n <= 1) return 0;
        int[,] dist = new int[n, n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i, j] = arr[1 + i*n + j];
        int INF = int.MaxValue / 2;
        int full = (1 << n) - 1;
        int[,] dp = new int[1 << n, n];
        for (int i = 0; i < (1 << n); i++)
            for (int j = 0; j < n; j++) dp[i, j] = INF;
        dp[1, 0] = 0;
        for (int mask = 1; mask <= full; mask++)
            for (int i = 0; i < n; i++)
            {
                if (dp[mask, i] >= INF || (mask & (1 << i)) == 0) continue;
                for (int j = 0; j < n; j++)
                {
                    if ((mask & (1 << j)) != 0) continue;
                    int nm = mask | (1 << j);
                    int cost = dp[mask, i] + dist[i, j];
                    if (cost < dp[nm, j]) dp[nm, j] = cost;
                }
            }
        int result = INF;
        for (int i = 0; i < n; i++) result = Math.Min(result, dp[full, i] + dist[i, 0]);
        return result;
    }
}
