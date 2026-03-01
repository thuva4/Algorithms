using System;
using System.Collections.Generic;

namespace Algorithms.Graph.DepthFirstSearch
{
    public class Dfs
    {
        public static int[] Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return new int[0];

            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 2 * m + 1) return new int[0];

            int start = arr[2 + 2 * m];
            if (start < 0 || start >= n) return new int[0];

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

            for (int i = 0; i < n; i++)
            {
                adj[i].Sort();
            }

            List<int> result = new List<int>();
            bool[] visited = new bool[n];

            DfsRecursive(start, adj, visited, result);

            return result.ToArray();
        }

        private static void DfsRecursive(int u, List<int>[] adj, bool[] visited, List<int> result)
        {
            visited[u] = true;
            result.Add(u);

            foreach (int v in adj[u])
            {
                if (!visited[v])
                {
                    DfsRecursive(v, adj, visited, result);
                }
            }
        }
    }
}
