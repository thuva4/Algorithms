using System;
using System.Collections.Generic;

public class GraphCycleDetection
{
    private static List<int>[] adj;
    private static int[] color;

    public static int Solve(int[] arr)
    {
        int n = arr[0], m = arr[1];
        adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        for (int i = 0; i < m; i++) adj[arr[2 + 2 * i]].Add(arr[2 + 2 * i + 1]);
        color = new int[n];
        for (int v = 0; v < n; v++)
        {
            if (color[v] == 0 && Dfs(v)) return 1;
        }
        return 0;
    }

    private static bool Dfs(int v)
    {
        color[v] = 1;
        foreach (int w in adj[v])
        {
            if (color[w] == 1) return true;
            if (color[w] == 0 && Dfs(w)) return true;
        }
        color[v] = 2;
        return false;
    }
}
