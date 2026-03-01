using System;
using System.Linq;

class BitmaskDp {
    public static int Solve(int n, int[][] cost) {
        int total = 1 << n;
        int[] dp = new int[total];
        Array.Fill(dp, int.MaxValue);
        dp[0] = 0;

        for (int mask = 0; mask < total; mask++) {
            if (dp[mask] == int.MaxValue) continue;
            int worker = BitCount(mask);
            if (worker >= n) continue;
            for (int job = 0; job < n; job++) {
                if ((mask & (1 << job)) == 0) {
                    int newMask = mask | (1 << job);
                    int newCost = dp[mask] + cost[worker][job];
                    if (newCost < dp[newMask]) dp[newMask] = newCost;
                }
            }
        }

        return dp[total - 1];
    }

    static int BitCount(int x) {
        int count = 0;
        while (x > 0) { count += x & 1; x >>= 1; }
        return count;
    }

    static void Main(string[] args) {
        int n = int.Parse(Console.ReadLine().Trim());
        int[][] cost = new int[n][];
        for (int i = 0; i < n; i++) {
            cost[i] = Console.ReadLine().Trim().Split(' ').Select(int.Parse).ToArray();
        }
        Console.WriteLine(Solve(n, cost));
    }
}
