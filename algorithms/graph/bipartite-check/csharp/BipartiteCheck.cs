using System;
using System.Collections.Generic;

namespace Algorithms.Graph.BipartiteCheck
{
    public class BipartiteCheck
    {
        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return 0;

            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 2 * m) return 0;
            if (n == 0) return 1;

            List<int>[] adj = new List<int>[n];
            for (int i = 0; i < n; i++) adj[i] = new List<int>();

            for (int i = 0; i < m; i++)
            {
                int u = arr[2 + 2 * i];
                int v = arr[2 + 2 * i + 1];
                if (u >= 0 && u < n && v >= 0 && v < n)
                {
                    adj[u].Add(v);
                    adj[v].Add(u);
                }
            }

            int[] color = new int[n]; // 0: none, 1: red, -1: blue
            Queue<int> q = new Queue<int>();

            for (int i = 0; i < n; i++)
            {
                if (color[i] == 0)
                {
                    color[i] = 1;
                    q.Enqueue(i);

                    while (q.Count > 0)
                    {
                        int u = q.Dequeue();

                        foreach (int v in adj[u])
                        {
                            if (color[v] == 0)
                            {
                                color[v] = -color[u];
                                q.Enqueue(v);
                            }
                            else if (color[v] == color[u])
                            {
                                return 0;
                            }
                        }
                    }
                }
            }

            return 1;
        }
    }
}
