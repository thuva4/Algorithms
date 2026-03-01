using System;
using System.Collections.Generic;

namespace Algorithms.Graph.ConnectedComponentLabeling
{
    public class ConnectedComponents
    {
        public static int[] Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return new int[0];

            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 2 * m) return new int[0];
            if (n == 0) return new int[0];

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

            int[] labels = new int[n];
            for (int i = 0; i < n; i++) labels[i] = -1;

            Queue<int> q = new Queue<int>();

            for (int i = 0; i < n; i++)
            {
                if (labels[i] == -1)
                {
                    int componentId = i;
                    labels[i] = componentId;
                    q.Enqueue(i);

                    while (q.Count > 0)
                    {
                        int u = q.Dequeue();

                        foreach (int v in adj[u])
                        {
                            if (labels[v] == -1)
                            {
                                labels[v] = componentId;
                                q.Enqueue(v);
                            }
                        }
                    }
                }
            }

            return labels;
        }
    }
}
