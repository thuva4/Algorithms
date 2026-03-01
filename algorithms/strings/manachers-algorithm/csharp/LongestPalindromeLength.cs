using System;
using System.Collections.Generic;

public class LongestPalindromeLength
{
    public static int Solve(int[] arr)
    {
        if (arr.Length == 0) return 0;

        var t = new List<int> { -1 };
        foreach (int x in arr)
        {
            t.Add(x);
            t.Add(-1);
        }

        int n = t.Count;
        int[] p = new int[n];
        int c = 0, r = 0, maxLen = 0;

        for (int i = 0; i < n; i++)
        {
            int mirror = 2 * c - i;
            if (i < r && mirror >= 0)
                p[i] = Math.Min(r - i, p[mirror]);
            while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] == t[i - p[i] - 1])
                p[i]++;
            if (i + p[i] > r) { c = i; r = i + p[i]; }
            if (p[i] > maxLen) maxLen = p[i];
        }

        return maxLen;
    }
}
