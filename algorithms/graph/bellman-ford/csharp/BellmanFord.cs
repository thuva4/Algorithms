using System;
using System.Collections.Generic;

namespace Algorithms.Graph.BellmanFord
{
    public class BellmanFord
    {
        private const int INF = 1000000000;

        public static int[] Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return new int[0];

            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 3 * m + 1) return new int[0];

            int start = arr[2 + 3 * m];

            if (start < 0 || start >= n) return new int[0];

            int[] dist = new int[n];
            for (int i = 0; i < n; i++) dist[i] = INF;
            dist[start] = 0;

            for (int i = 0; i < n - 1; i++)
            {
                for (int j = 0; j < m; j++)
                {
                    int u = arr[2 + 3 * j];
                    int v = arr[2 + 3 * j + 1];
                    int w = arr[2 + 3 * j + 2];

                    if (dist[u] != INF && dist[u] + w < dist[v])
                    {
                        dist[v] = dist[u] + w;
                    }
                }
            }

            for (int j = 0; j < m; j++)
            {
                int u = arr[2 + 3 * j];
                int v = arr[2 + 3 * j + 1];
                int w = arr[2 + 3 * j + 2];

                if (dist[u] != INF && dist[u] + w < dist[v])
                {
                    return new int[0]; // Negative cycle
                }
            }

            return dist;
        }
    }
}
