using System;

public class WordBreak
{
    /// <summary>
    /// Determine if target can be formed by summing elements from arr
    /// with repetition allowed.
    /// </summary>
    /// <param name="arr">Array of positive integers (available elements)</param>
    /// <param name="target">The target sum to reach</param>
    /// <returns>1 if target is achievable, 0 otherwise</returns>
    public static int CanSum(int[] arr, int target)
    {
        if (target == 0) return 1;

        bool[] dp = new bool[target + 1];
        dp[0] = true;

        for (int i = 1; i <= target; i++)
        {
            foreach (int elem in arr)
            {
                if (elem <= i && dp[i - elem])
                {
                    dp[i] = true;
                    break;
                }
            }
        }

        return dp[target] ? 1 : 0;
    }

    static void Main(string[] args)
    {
        Console.WriteLine(CanSum(new int[] { 2, 3 }, 7));   // 1
        Console.WriteLine(CanSum(new int[] { 5, 3 }, 8));   // 1
        Console.WriteLine(CanSum(new int[] { 2, 4 }, 7));   // 0
        Console.WriteLine(CanSum(new int[] { 1 }, 5));      // 1
        Console.WriteLine(CanSum(new int[] { 7 }, 3));      // 0
    }
}
