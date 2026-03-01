using System;
using System.Collections.Generic;

namespace Algorithms.Graph.Bridges
{
    public class Bridges
    {
        private static List<int>[] adj;
        private static int[] dfn, low;
        private static int timer, bridgeCount;

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return 0;
            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 2 * m) return 0;

            adj = new List<int>[n];
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

            dfn = new int[n];
            low = new int[n];
            timer = 0;
            bridgeCount = 0;

            for (int i = 0; i < n; i++)
            {
                if (dfn[i] == 0) Dfs(i, -1);
            }

            return bridgeCount;
        }

        private static void Dfs(int u, int p)
        {
            dfn[u] = low[u] = ++timer;

            foreach (int v in adj[u])
            {
                if (v == p) continue;
                if (dfn[v] != 0)
                {
                    low[u] = Math.Min(low[u], dfn[v]);
                }
                else
                {
                    Dfs(v, u);
                    low[u] = Math.Min(low[u], low[v]);
                    if (low[v] > dfn[u])
                    {
                        bridgeCount++;
                    }
                }
            }
        }
    }
}
