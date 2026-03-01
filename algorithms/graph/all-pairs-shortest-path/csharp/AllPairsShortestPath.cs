using System;

namespace Algorithms.Graph.AllPairsShortestPath
{
    public class AllPairsShortestPath
    {
        private const int INF = 1000000000;

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return -1;

            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 3 * m) return -1;
            if (n <= 0) return -1;
            if (n == 1) return 0;

            int[,] dist = new int[n, n];
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    if (i == j) dist[i, j] = 0;
                    else dist[i, j] = INF;
                }
            }

            for (int i = 0; i < m; i++)
            {
                int u = arr[2 + 3 * i];
                int v = arr[2 + 3 * i + 1];
                int w = arr[2 + 3 * i + 2];

                if (u >= 0 && u < n && v >= 0 && v < n)
                {
                    if (w < dist[u, v])
                    {
                        dist[u, v] = w;
                    }
                }
            }

            for (int k = 0; k < n; k++)
            {
                for (int i = 0; i < n; i++)
                {
                    for (int j = 0; j < n; j++)
                    {
                        if (dist[i, k] != INF && dist[k, j] != INF)
                        {
                            if (dist[i, k] + dist[k, j] < dist[i, j])
                            {
                                dist[i, j] = dist[i, k] + dist[k, j];
                            }
                        }
                    }
                }
            }

            int result = dist[0, n - 1];
            return (result == INF) ? -1 : result;
        }
    }
}
