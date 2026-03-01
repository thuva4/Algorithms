using System;
using System.Linq;

public class CanPartition
{
    public static int Solve(int[] arr)
    {
        int total = arr.Sum();
        if (total % 2 != 0) return 0;
        int target = total / 2;
        bool[] dp = new bool[target + 1];
        dp[0] = true;
        foreach (int num in arr)
        {
            for (int j = target; j >= num; j--)
            {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        return dp[target] ? 1 : 0;
    }
}
