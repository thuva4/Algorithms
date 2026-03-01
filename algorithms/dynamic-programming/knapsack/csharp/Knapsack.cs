using System;

public class Knapsack
{
    public static int Solve(int[] weights, int[] values, int capacity)
    {
        int n = weights.Length;
        int[,] dp = new int[n + 1, capacity + 1];

        for (int i = 1; i <= n; i++)
        {
            for (int w = 0; w <= capacity; w++)
            {
                if (weights[i - 1] > w)
                    dp[i, w] = dp[i - 1, w];
                else
                    dp[i, w] = Math.Max(dp[i - 1, w], dp[i - 1, w - weights[i - 1]] + values[i - 1]);
            }
        }

        return dp[n, capacity];
    }

    static void Main(string[] args)
    {
        int[] weights = { 1, 3, 4, 5 };
        int[] values = { 1, 4, 5, 7 };
        int capacity = 7;
        Console.WriteLine(Solve(weights, values, capacity)); // 9
    }
}
