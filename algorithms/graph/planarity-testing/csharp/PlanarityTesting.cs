using System;
using System.Collections.Generic;

public class PlanarityTesting
{
    public static int Solve(int[] arr)
    {
        int n = arr[0], m = arr[1];
        var edges = new HashSet<long>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[2+2*i], v = arr[2+2*i+1];
            if (u != v)
            {
                int a = Math.Min(u, v), b = Math.Max(u, v);
                edges.Add((long)a * n + b);
            }
        }
        int e = edges.Count;
        if (n < 3) return 1;
        return e <= 3 * n - 6 ? 1 : 0;
    }
}
