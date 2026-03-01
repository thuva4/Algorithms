using System;
using System.Collections.Generic;

public class CountBridges
{
    private static int timer, bridgeCount;
    private static int[] disc, low, parent;
    private static List<int>[] adj;

    public static int Solve(int[] arr)
    {
        int n = arr[0];
        int m = arr[1];
        adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj[u].Add(v);
            adj[v].Add(u);
        }

        disc = new int[n];
        low = new int[n];
        parent = new int[n];
        for (int i = 0; i < n; i++) { disc[i] = -1; parent[i] = -1; }
        timer = 0;
        bridgeCount = 0;

        for (int i = 0; i < n; i++)
            if (disc[i] == -1) Dfs(i);

        return bridgeCount;
    }

    private static void Dfs(int u)
    {
        disc[u] = timer;
        low[u] = timer;
        timer++;

        foreach (int v in adj[u])
        {
            if (disc[v] == -1)
            {
                parent[v] = u;
                Dfs(v);
                low[u] = Math.Min(low[u], low[v]);
                if (low[v] > disc[u]) bridgeCount++;
            }
            else if (v != parent[u])
            {
                low[u] = Math.Min(low[u], disc[v]);
            }
        }
    }
}
