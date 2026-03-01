using System;

public class CoinChange
{
    public static int Solve(int[] coins, int amount)
    {
        if (amount == 0) return 0;

        int[] dp = new int[amount + 1];
        for (int i = 1; i <= amount; i++)
            dp[i] = int.MaxValue;

        for (int i = 1; i <= amount; i++)
        {
            foreach (int coin in coins)
            {
                if (coin <= i && dp[i - coin] != int.MaxValue)
                {
                    dp[i] = Math.Min(dp[i], dp[i - coin] + 1);
                }
            }
        }

        return dp[amount] == int.MaxValue ? -1 : dp[amount];
    }

    static void Main(string[] args)
    {
        int[] coins = { 1, 5, 10, 25 };
        Console.WriteLine(Solve(coins, 30)); // 2
    }
}
