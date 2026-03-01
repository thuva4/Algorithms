public class HamiltonianPath
{
    public static int Run(int[] arr)
    {
        int n = arr[0], m = arr[1];
        if (n <= 1) return 1;
        bool[,] adj = new bool[n, n];
        for (int i = 0; i < m; i++)
        {
            int u = arr[2+2*i], v = arr[3+2*i];
            adj[u, v] = true; adj[v, u] = true;
        }
        int full = (1 << n) - 1;
        bool[,] dp = new bool[1 << n, n];
        for (int i = 0; i < n; i++) dp[1 << i, i] = true;
        for (int mask = 1; mask <= full; mask++)
            for (int i = 0; i < n; i++)
            {
                if (!dp[mask, i]) continue;
                for (int j = 0; j < n; j++)
                    if ((mask & (1 << j)) == 0 && adj[i, j])
                        dp[mask | (1 << j), j] = true;
            }
        for (int i = 0; i < n; i++) if (dp[full, i]) return 1;
        return 0;
    }
}
