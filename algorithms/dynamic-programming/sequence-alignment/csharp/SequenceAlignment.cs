using System;

public class SequenceAlignment
{
    const int GapCost = 4;
    const int MismatchCost = 3;

    public static int Solve(string s1, string s2)
    {
        int m = s1.Length;
        int n = s2.Length;
        int[,] dp = new int[m + 1, n + 1];

        for (int i = 0; i <= m; i++) dp[i, 0] = i * GapCost;
        for (int j = 0; j <= n; j++) dp[0, j] = j * GapCost;

        for (int i = 1; i <= m; i++)
        {
            for (int j = 1; j <= n; j++)
            {
                int matchCost = (s1[i - 1] == s2[j - 1]) ? 0 : MismatchCost;
                dp[i, j] = Math.Min(
                    Math.Min(dp[i - 1, j] + GapCost, dp[i, j - 1] + GapCost),
                    dp[i - 1, j - 1] + matchCost
                );
            }
        }

        return dp[m, n];
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve("GCCCTAGCG", "GCGCAATG")); // 18
    }
}
