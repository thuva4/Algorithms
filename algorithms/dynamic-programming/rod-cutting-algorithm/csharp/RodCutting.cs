using System;

public class RodCutting
{
    public static int RodCut(int[] prices, int n)
    {
        int[] dp = new int[n + 1];

        for (int i = 1; i <= n; i++)
        {
            for (int j = 0; j < i; j++)
            {
                dp[i] = Math.Max(dp[i], prices[j] + dp[i - j - 1]);
            }
        }

        return dp[n];
    }

    static void Main(string[] args)
    {
        int[] prices = { 1, 5, 8, 9, 10, 17, 17, 20 };
        Console.WriteLine(RodCut(prices, 8)); // 22
    }
}
