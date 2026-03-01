using System;

public class LongestCommonSubstring
{
    /// <summary>
    /// Find the length of the longest contiguous subarray common to both arrays.
    /// </summary>
    /// <param name="arr1">First array of integers</param>
    /// <param name="arr2">Second array of integers</param>
    /// <returns>Length of the longest common contiguous subarray</returns>
    public static int Solve(int[] arr1, int[] arr2)
    {
        int n = arr1.Length;
        int m = arr2.Length;
        int maxLen = 0;

        int[,] dp = new int[n + 1, m + 1];

        for (int i = 1; i <= n; i++)
        {
            for (int j = 1; j <= m; j++)
            {
                if (arr1[i - 1] == arr2[j - 1])
                {
                    dp[i, j] = dp[i - 1, j - 1] + 1;
                    if (dp[i, j] > maxLen)
                    {
                        maxLen = dp[i, j];
                    }
                }
                else
                {
                    dp[i, j] = 0;
                }
            }
        }

        return maxLen;
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(
            new int[] { 1, 2, 3, 4, 5 }, new int[] { 3, 4, 5, 6, 7 }));   // 3
        Console.WriteLine(Solve(
            new int[] { 1, 2, 3 }, new int[] { 4, 5, 6 }));                 // 0
        Console.WriteLine(Solve(
            new int[] { 1, 2, 3, 4 }, new int[] { 1, 2, 3, 4 }));           // 4
        Console.WriteLine(Solve(
            new int[] { 1 }, new int[] { 1 }));                              // 1
        Console.WriteLine(Solve(
            new int[] { 1, 2, 3, 2, 1 }, new int[] { 3, 2, 1, 4, 7 }));    // 3
    }
}
