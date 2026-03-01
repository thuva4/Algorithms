using System;
using System.Collections.Generic;

namespace Algorithms.Graph.Dijkstras
{
    public class Dijkstra
    {
        private const int INF = 1000000000;

        private struct Edge
        {
            public int To;
            public int Weight;
        }

        public static int[] Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return new int[0];

            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 3 * m + 1) return new int[0];

            int start = arr[2 + 3 * m];
            if (start < 0 || start >= n) return new int[0];

            List<Edge>[] adj = new List<Edge>[n];
            for (int i = 0; i < n; i++) adj[i] = new List<Edge>();

            for (int i = 0; i < m; i++)
            {
                int u = arr[2 + 3 * i];
                int v = arr[2 + 3 * i + 1];
                int w = arr[2 + 3 * i + 2];
                if (u >= 0 && u < n && v >= 0 && v < n)
                {
                    adj[u].Add(new Edge { To = v, Weight = w });
                }
            }

            int[] dist = new int[n];
            for (int i = 0; i < n; i++) dist[i] = INF;
            dist[start] = 0;

            PriorityQueue<int, int> pq = new PriorityQueue<int, int>();
            pq.Enqueue(start, 0);

            while (pq.Count > 0)
            {
                if (!pq.TryDequeue(out int u, out int d)) break;

                if (d > dist[u]) continue;

                foreach (var e in adj[u])
                {
                    if (dist[u] + e.Weight < dist[e.To])
                    {
                        dist[e.To] = dist[u] + e.Weight;
                        pq.Enqueue(e.To, dist[e.To]);
                    }
                }
            }

            return dist;
        }
    }
}
