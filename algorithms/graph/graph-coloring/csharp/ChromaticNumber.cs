using System;
using System.Collections.Generic;

public class ChromaticNumber
{
    private static List<int>[] adj;
    private static int n;

    public static int Solve(int[] arr)
    {
        n = arr[0];
        int m = arr[1];
        if (n == 0) return 0;
        if (m == 0) return 1;

        adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj[u].Add(v);
            adj[v].Add(u);
        }

        for (int k = 1; k <= n; k++)
        {
            int[] colors = new int[n];
            if (CanColor(colors, 0, k)) return k;
        }
        return n;
    }

    private static bool IsSafe(int[] colors, int v, int c)
    {
        foreach (int u in adj[v])
            if (colors[u] == c) return false;
        return true;
    }

    private static bool CanColor(int[] colors, int v, int k)
    {
        if (v == n) return true;
        for (int c = 1; c <= k; c++)
        {
            if (IsSafe(colors, v, c))
            {
                colors[v] = c;
                if (CanColor(colors, v + 1, k)) return true;
                colors[v] = 0;
            }
        }
        return false;
    }
}
