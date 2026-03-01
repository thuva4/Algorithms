using System;
using System.Collections.Generic;

namespace Algorithms.Graph.TwoSat
{
    public class TwoSat
    {
        private static List<int>[] adj;
        private static int[] dfn, low, sccId;
        private static bool[] inStack;
        private static Stack<int> stack;
        private static int timer, sccCnt;

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return 0;
            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 2 * m) return 0;

            int numNodes = 2 * n;
            adj = new List<int>[numNodes];
            for (int i = 0; i < numNodes; i++) adj[i] = new List<int>();

            for (int i = 0; i < m; i++)
            {
                int uRaw = arr[2 + 2 * i];
                int vRaw = arr[2 + 2 * i + 1];

                int u = (Math.Abs(uRaw) - 1) * 2 + (uRaw < 0 ? 1 : 0);
                int v = (Math.Abs(vRaw) - 1) * 2 + (vRaw < 0 ? 1 : 0);

                int notU = u ^ 1;
                int notV = v ^ 1;

                adj[notU].Add(v);
                adj[notV].Add(u);
            }

            dfn = new int[numNodes];
            low = new int[numNodes];
            sccId = new int[numNodes];
            inStack = new bool[numNodes];
            stack = new Stack<int>();
            timer = 0;
            sccCnt = 0;

            for (int i = 0; i < numNodes; i++)
            {
                if (dfn[i] == 0) Tarjan(i);
            }

            for (int i = 0; i < n; i++)
            {
                if (sccId[2 * i] == sccId[2 * i + 1]) return 0;
            }

            return 1;
        }

        private static void Tarjan(int u)
        {
            dfn[u] = low[u] = ++timer;
            stack.Push(u);
            inStack[u] = true;

            foreach (int v in adj[u])
            {
                if (dfn[v] == 0)
                {
                    Tarjan(v);
                    low[u] = Math.Min(low[u], low[v]);
                }
                else if (inStack[v])
                {
                    low[u] = Math.Min(low[u], dfn[v]);
                }
            }

            if (low[u] == dfn[u])
            {
                sccCnt++;
                int v;
                do
                {
                    v = stack.Pop();
                    inStack[v] = false;
                    sccId[v] = sccCnt;
                } while (u != v);
            }
        }
    }
}
