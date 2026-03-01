using System;
using System.Collections.Generic;

public class ShortestPathDag
{
    /// <summary>
    /// Find shortest path from source to vertex n-1 in a DAG.
    /// Input format: [n, m, src, u1, v1, w1, ...]
    /// </summary>
    /// <param name="arr">Input array</param>
    /// <returns>Shortest distance from src to n-1, or -1 if unreachable</returns>
    public static int Solve(int[] arr)
    {
        int idx = 0;
        int n = arr[idx++];
        int m = arr[idx++];
        int src = arr[idx++];

        var adj = new List<(int to, int w)>[n];
        int[] inDegree = new int[n];
        for (int i = 0; i < n; i++) adj[i] = new List<(int, int)>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[idx++], v = arr[idx++], w = arr[idx++];
            adj[u].Add((v, w));
            inDegree[v]++;
        }

        var queue = new Queue<int>();
        for (int i = 0; i < n; i++)
            if (inDegree[i] == 0) queue.Enqueue(i);

        var topoOrder = new List<int>();
        while (queue.Count > 0)
        {
            int node = queue.Dequeue();
            topoOrder.Add(node);
            foreach (var (v, _) in adj[node])
            {
                if (--inDegree[v] == 0) queue.Enqueue(v);
            }
        }

        int INF = int.MaxValue;
        int[] dist = new int[n];
        Array.Fill(dist, INF);
        dist[src] = 0;

        foreach (int u in topoOrder)
        {
            if (dist[u] == INF) continue;
            foreach (var (v, w) in adj[u])
            {
                if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
            }
        }

        return dist[n - 1] == INF ? -1 : dist[n - 1];
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7 }));
        Console.WriteLine(Solve(new int[] { 3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1 }));
        Console.WriteLine(Solve(new int[] { 2, 1, 0, 0, 1, 10 }));
        Console.WriteLine(Solve(new int[] { 3, 1, 0, 1, 2, 5 }));
    }
}
