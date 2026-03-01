using System;

public class ZFunction
{
    public static int[] Solve(int[] arr)
    {
        int n = arr.Length;
        int[] z = new int[n];
        int l = 0, r = 0;
        for (int i = 1; i < n; i++)
        {
            if (i < r)
                z[i] = Math.Min(r - i, z[i - l]);
            while (i + z[i] < n && arr[z[i]] == arr[i + z[i]])
                z[i]++;
            if (i + z[i] > r)
            {
                l = i;
                r = i + z[i];
            }
        }
        return z;
    }
}
