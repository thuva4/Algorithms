using System;

public class LIS
{
    public static int Lis(int[] arr)
    {
        int n = arr.Length;
        if (n == 0) return 0;

        int[] dp = new int[n];
        for (int i = 0; i < n; i++)
            dp[i] = 1;

        int maxLen = 1;
        for (int i = 1; i < n; i++)
        {
            for (int j = 0; j < i; j++)
            {
                if (arr[j] < arr[i] && dp[j] + 1 > dp[i])
                    dp[i] = dp[j] + 1;
            }
            if (dp[i] > maxLen)
                maxLen = dp[i];
        }

        return maxLen;
    }

    static void Main(string[] args)
    {
        int[] arr = { 10, 9, 2, 5, 3, 7, 101, 18 };
        Console.WriteLine(Lis(arr)); // 4
    }
}
