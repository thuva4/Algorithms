using System;

public class DungeonGame
{
    public static int Solve(int[][] grid)
    {
        int m = grid.Length;
        if (m == 0) return 0;
        int n = grid[0].Length;

        int[][] dp = new int[m][];
        for (int i = 0; i < m; i++)
            dp[i] = new int[n];

        for (int i = m - 1; i >= 0; i--)
        {
            for (int j = n - 1; j >= 0; j--)
            {
                if (i == m - 1 && j == n - 1)
                    dp[i][j] = Math.Min(0, grid[i][j]);
                else if (i == m - 1)
                    dp[i][j] = Math.Min(0, grid[i][j] + dp[i][j + 1]);
                else if (j == n - 1)
                    dp[i][j] = Math.Min(0, grid[i][j] + dp[i + 1][j]);
                else
                    dp[i][j] = Math.Min(0, grid[i][j] + Math.Max(dp[i][j + 1], dp[i + 1][j]));
            }
        }

        return Math.Abs(dp[0][0]) + 1;
    }

    static void Main(string[] args)
    {
        int[][] grid = new int[][] {
            new int[] {-2, -3, 3},
            new int[] {-5, -10, 1},
            new int[] {10, 30, -5}
        };
        Console.WriteLine(Solve(grid)); // 7
    }
}
