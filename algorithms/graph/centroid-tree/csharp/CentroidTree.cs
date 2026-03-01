using System;
using System.Collections.Generic;

namespace Algorithms.Graph.CentroidTree
{
    public class CentroidTree
    {
        private static List<int>[] adj;
        private static int[] sz;
        private static bool[] removed;
        private static int maxDepth;

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 1) return 0;
            int n = arr[0];

            if (n <= 1) return 0;
            if (arr.Length < 1 + 2 * (n - 1)) return 0;

            adj = new List<int>[n];
            for (int i = 0; i < n; i++) adj[i] = new List<int>();

            for (int i = 0; i < n - 1; i++)
            {
                int u = arr[1 + 2 * i];
                int v = arr[1 + 2 * i + 1];
                if (u >= 0 && u < n && v >= 0 && v < n)
                {
                    adj[u].Add(v);
                    adj[v].Add(u);
                }
            }

            sz = new int[n];
            removed = new bool[n];
            maxDepth = 0;

            Decompose(0, 0);

            return maxDepth;
        }

        private static void GetSize(int u, int p)
        {
            sz[u] = 1;
            foreach (int v in adj[u])
            {
                if (v != p && !removed[v])
                {
                    GetSize(v, u);
                    sz[u] += sz[v];
                }
            }
        }

        private static int GetCentroid(int u, int p, int total)
        {
            foreach (int v in adj[u])
            {
                if (v != p && !removed[v] && sz[v] > total / 2)
                {
                    return GetCentroid(v, u, total);
                }
            }
            return u;
        }

        private static void Decompose(int u, int depth)
        {
            GetSize(u, -1);
            int total = sz[u];
            int centroid = GetCentroid(u, -1, total);

            maxDepth = Math.Max(maxDepth, depth);

            removed[centroid] = true;

            foreach (int v in adj[centroid])
            {
                if (!removed[v])
                {
                    Decompose(v, depth + 1);
                }
            }
        }
    }
}
