using System;
using System.Collections.Generic;

public class LongestSubsetZeroSum
{
    public static int Solve(int[] arr)
    {
        int n = arr.Length;
        int maxLen = 0;
        var sumMap = new Dictionary<int, int>();
        sumMap[0] = -1;
        int sum = 0;

        for (int i = 0; i < n; i++)
        {
            sum += arr[i];
            if (sumMap.ContainsKey(sum))
            {
                int length = i - sumMap[sum];
                maxLen = Math.Max(maxLen, length);
            }
            else
            {
                sumMap[sum] = i;
            }
        }

        return maxLen;
    }

    static void Main(string[] args)
    {
        int[] arr = { 1, 2, -3, 3 };
        Console.WriteLine(Solve(arr)); // 3
    }
}
