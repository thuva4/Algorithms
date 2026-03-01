using System;

public class LongestPalindromeSubarray
{
    public static int Solve(int[] arr)
    {
        int n = arr.Length;
        if (n == 0) return 0;

        int maxLen = 1;
        for (int i = 0; i < n; i++)
        {
            int odd = Expand(arr, i, i);
            int even = Expand(arr, i, i + 1);
            maxLen = Math.Max(maxLen, Math.Max(odd, even));
        }
        return maxLen;
    }

    private static int Expand(int[] arr, int l, int r)
    {
        while (l >= 0 && r < arr.Length && arr[l] == arr[r])
        {
            l--;
            r++;
        }
        return r - l - 1;
    }
}
