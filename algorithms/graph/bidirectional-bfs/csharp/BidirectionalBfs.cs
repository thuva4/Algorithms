using System;
using System.Collections.Generic;

namespace Algorithms.Graph.BidirectionalBfs
{
    public class BidirectionalBfs
    {
        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 4) return -1;

            int n = arr[0];
            int m = arr[1];
            int start = arr[2];
            int end = arr[3];

            if (arr.Length < 4 + 2 * m) return -1;
            if (start == end) return 0;

            List<int>[] adj = new List<int>[n];
            for (int i = 0; i < n; i++) adj[i] = new List<int>();

            for (int i = 0; i < m; i++)
            {
                int u = arr[4 + 2 * i];
                int v = arr[4 + 2 * i + 1];
                if (u >= 0 && u < n && v >= 0 && v < n)
                {
                    adj[u].Add(v);
                    adj[v].Add(u);
                }
            }

            int[] distStart = new int[n];
            int[] distEnd = new int[n];
            Array.Fill(distStart, -1);
            Array.Fill(distEnd, -1);

            Queue<int> qStart = new Queue<int>();
            Queue<int> qEnd = new Queue<int>();

            qStart.Enqueue(start);
            distStart[start] = 0;

            qEnd.Enqueue(end);
            distEnd[end] = 0;

            while (qStart.Count > 0 && qEnd.Count > 0)
            {
                int u = qStart.Dequeue();
                if (distEnd[u] != -1) return distStart[u] + distEnd[u];

                foreach (int v in adj[u])
                {
                    if (distStart[v] == -1)
                    {
                        distStart[v] = distStart[u] + 1;
                        if (distEnd[v] != -1) return distStart[v] + distEnd[v];
                        qStart.Enqueue(v);
                    }
                }

                u = qEnd.Dequeue();
                if (distStart[u] != -1) return distStart[u] + distEnd[u];

                foreach (int v in adj[u])
                {
                    if (distEnd[v] == -1)
                    {
                        distEnd[v] = distEnd[u] + 1;
                        if (distStart[v] != -1) return distStart[v] + distEnd[v];
                        qEnd.Enqueue(v);
                    }
                }
            }

            return -1;
        }
    }
}
