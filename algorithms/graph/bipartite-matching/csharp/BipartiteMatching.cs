using System;
using System.Collections.Generic;

namespace Algorithms.Graph.BipartiteMatching
{
    public class BipartiteMatching
    {
        private static int nLeft, nRight;
        private static List<int>[] adj;
        private static int[] pairU, pairV, dist;

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 3) return 0;

            nLeft = arr[0];
            nRight = arr[1];
            int m = arr[2];

            if (arr.Length < 3 + 2 * m) return 0;
            if (nLeft == 0 || nRight == 0) return 0;

            adj = new List<int>[nLeft];
            for (int i = 0; i < nLeft; i++) adj[i] = new List<int>();

            for (int i = 0; i < m; i++)
            {
                int u = arr[3 + 2 * i];
                int v = arr[3 + 2 * i + 1];
                if (u >= 0 && u < nLeft && v >= 0 && v < nRight)
                {
                    adj[u].Add(v);
                }
            }

            pairU = new int[nLeft];
            pairV = new int[nRight];
            dist = new int[nLeft + 1];

            Array.Fill(pairU, -1);
            Array.Fill(pairV, -1);

            int matching = 0;
            while (Bfs())
            {
                for (int u = 0; u < nLeft; u++)
                {
                    if (pairU[u] == -1 && Dfs(u))
                    {
                        matching++;
                    }
                }
            }

            return matching;
        }

        private static bool Bfs()
        {
            Queue<int> q = new Queue<int>();
            for (int u = 0; u < nLeft; u++)
            {
                if (pairU[u] == -1)
                {
                    dist[u] = 0;
                    q.Enqueue(u);
                }
                else
                {
                    dist[u] = int.MaxValue;
                }
            }

            dist[nLeft] = int.MaxValue;

            while (q.Count > 0)
            {
                int u = q.Dequeue();

                if (dist[u] < dist[nLeft])
                {
                    foreach (int v in adj[u])
                    {
                        int pu = pairV[v];
                        if (pu == -1)
                        {
                            if (dist[nLeft] == int.MaxValue)
                            {
                                dist[nLeft] = dist[u] + 1;
                            }
                        }
                        else if (dist[pu] == int.MaxValue)
                        {
                            dist[pu] = dist[u] + 1;
                            q.Enqueue(pu);
                        }
                    }
                }
            }

            return dist[nLeft] != int.MaxValue;
        }

        private static bool Dfs(int u)
        {
            if (u != -1)
            {
                foreach (int v in adj[u])
                {
                    int pu = pairV[v];
                    if (pu == -1 || (dist[pu] == dist[u] + 1 && Dfs(pu)))
                    {
                        pairV[v] = u;
                        pairU[u] = v;
                        return true;
                    }
                }
                dist[u] = int.MaxValue;
                return false;
            }
            return true;
        }
    }
}
