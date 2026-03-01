using System;
using System.Collections.Generic;

namespace Algorithms.Graph.Dinic
{
    public class Dinic
    {
        private class Edge
        {
            public int To;
            public int Rev;
            public long Cap;
            public long Flow;
        }

        private static List<Edge>[] adj;
        private static int[] level;
        private static int[] ptr;

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 4) return 0;
            int n = arr[0];
            int m = arr[1];
            int s = arr[2];
            int t = arr[3];

            if (arr.Length < 4 + 3 * m) return 0;

            adj = new List<Edge>[n];
            for (int i = 0; i < n; i++) adj[i] = new List<Edge>();

            for (int i = 0; i < m; i++)
            {
                int u = arr[4 + 3 * i];
                int v = arr[4 + 3 * i + 1];
                long cap = arr[4 + 3 * i + 2];
                if (u >= 0 && u < n && v >= 0 && v < n)
                {
                    AddEdge(u, v, cap);
                }
            }

            level = new int[n];
            ptr = new int[n];

            long flow = 0;
            while (Bfs(s, t, n))
            {
                Array.Fill(ptr, 0);
                while (true)
                {
                    long pushed = Dfs(s, t, long.MaxValue);
                    if (pushed == 0) break;
                    flow += pushed;
                }
            }

            return (int)flow;
        }

        private static void AddEdge(int u, int v, long cap)
        {
            Edge a = new Edge { To = v, Rev = adj[v].Count, Cap = cap, Flow = 0 };
            Edge b = new Edge { To = u, Rev = adj[u].Count, Cap = 0, Flow = 0 };
            adj[u].Add(a);
            adj[v].Add(b);
        }

        private static bool Bfs(int s, int t, int n)
        {
            Array.Fill(level, -1);
            level[s] = 0;
            Queue<int> q = new Queue<int>();
            q.Enqueue(s);

            while (q.Count > 0)
            {
                int u = q.Dequeue();
                foreach (var e in adj[u])
                {
                    if (e.Cap - e.Flow > 0 && level[e.To] == -1)
                    {
                        level[e.To] = level[u] + 1;
                        q.Enqueue(e.To);
                    }
                }
            }
            return level[t] != -1;
        }

        private static long Dfs(int u, int t, long pushed)
        {
            if (pushed == 0) return 0;
            if (u == t) return pushed;

            for (; ptr[u] < adj[u].Count; ptr[u]++)
            {
                int cid = ptr[u];
                var e = adj[u][cid];
                int v = e.To;

                if (level[u] + 1 != level[v] || e.Cap - e.Flow == 0) continue;

                long tr = pushed;
                if (e.Cap - e.Flow < tr) tr = e.Cap - e.Flow;

                long pushedFlow = Dfs(v, t, tr);
                if (pushedFlow == 0) continue;

                e.Flow += pushedFlow;
                adj[v][e.Rev].Flow -= pushedFlow;

                return pushedFlow;
            }

            return 0;
        }
    }
}
