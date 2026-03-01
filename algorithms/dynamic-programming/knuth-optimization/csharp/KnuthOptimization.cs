using System;

public class KnuthOptimization
{
    public static int Solve(int n, int[] freq)
    {
        if (n == 0) return 0;
        int[,] dp = new int[n, n];
        int[,] opt = new int[n, n];
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + freq[i];

        for (int i = 0; i < n; i++)
        {
            dp[i, i] = freq[i];
            opt[i, i] = i;
        }

        for (int len = 2; len <= n; len++)
        {
            for (int i = 0; i <= n - len; i++)
            {
                int j = i + len - 1;
                dp[i, j] = int.MaxValue;
                int costSum = prefix[j + 1] - prefix[i];
                int lo = opt[i, j - 1];
                int hi = (i + 1 <= j) ? opt[i + 1, j] : j;
                for (int k = lo; k <= hi; k++)
                {
                    int left = (k > i) ? dp[i, k - 1] : 0;
                    int right = (k < j) ? dp[k + 1, j] : 0;
                    int val = left + right + costSum;
                    if (val < dp[i, j])
                    {
                        dp[i, j] = val;
                        opt[i, j] = k;
                    }
                }
            }
        }
        return dp[0, n - 1];
    }

    public static void Main(string[] args)
    {
        string[] tokens = Console.ReadLine().Trim().Split();
        int n = int.Parse(tokens[0]);
        int[] freq = new int[n];
        for (int i = 0; i < n; i++) freq[i] = int.Parse(tokens[i + 1]);
        Console.WriteLine(Solve(n, freq));
    }
}
