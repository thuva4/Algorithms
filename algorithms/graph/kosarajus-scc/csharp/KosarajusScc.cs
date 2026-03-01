using System;
using System.Collections.Generic;

public class KosarajusScc
{
    public static int Solve(int[] arr)
    {
        int n = arr[0];
        int m = arr[1];
        var adj = new List<int>[n];
        var radj = new List<int>[n];
        for (int i = 0; i < n; i++)
        {
            adj[i] = new List<int>();
            radj[i] = new List<int>();
        }
        for (int i = 0; i < m; i++)
        {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj[u].Add(v);
            radj[v].Add(u);
        }

        bool[] visited = new bool[n];
        List<int> order = new List<int>();

        void Dfs1(int v)
        {
            visited[v] = true;
            foreach (int w in adj[v])
                if (!visited[w]) Dfs1(w);
            order.Add(v);
        }

        for (int v = 0; v < n; v++)
            if (!visited[v]) Dfs1(v);

        Array.Fill(visited, false);
        int sccCount = 0;

        void Dfs2(int v)
        {
            visited[v] = true;
            foreach (int w in radj[v])
                if (!visited[w]) Dfs2(w);
        }

        for (int i = order.Count - 1; i >= 0; i--)
        {
            int v = order[i];
            if (!visited[v])
            {
                Dfs2(v);
                sccCount++;
            }
        }

        return sccCount;
    }
}
