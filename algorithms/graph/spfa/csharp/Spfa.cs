using System;
using System.Collections.Generic;

public class Spfa
{
    public static int Solve(int[] arr)
    {
        int n = arr[0];
        int m = arr[1];
        int src = arr[2];
        var adj = new List<(int v, int w)>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<(int, int)>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[3 + 3 * i];
            int v = arr[3 + 3 * i + 1];
            int w = arr[3 + 3 * i + 2];
            adj[u].Add((v, w));
        }

        int INF = int.MaxValue / 2;
        int[] dist = new int[n];
        for (int i = 0; i < n; i++) dist[i] = INF;
        dist[src] = 0;
        bool[] inQueue = new bool[n];
        var queue = new Queue<int>();
        queue.Enqueue(src);
        inQueue[src] = true;

        while (queue.Count > 0)
        {
            int u = queue.Dequeue();
            inQueue[u] = false;
            foreach (var (v, w) in adj[u])
            {
                if (dist[u] + w < dist[v])
                {
                    dist[v] = dist[u] + w;
                    if (!inQueue[v])
                    {
                        queue.Enqueue(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        return dist[n - 1] == INF ? -1 : dist[n - 1];
    }
}
