using System;
using System.Collections.Generic;

public class MinimumSpanningArborescence
{
    public static int Solve(int[] arr)
    {
        int n = arr[0];
        int m = arr[1];
        int root = arr[2];
        var eu = new List<int>();
        var ev = new List<int>();
        var ew = new List<int>();
        for (int i = 0; i < m; i++)
        {
            eu.Add(arr[3 + 3 * i]);
            ev.Add(arr[3 + 3 * i + 1]);
            ew.Add(arr[3 + 3 * i + 2]);
        }

        int INF = int.MaxValue / 2;
        int res = 0;

        while (true)
        {
            int[] minIn = new int[n];
            int[] minEdge = new int[n];
            for (int i = 0; i < n; i++) { minIn[i] = INF; minEdge[i] = -1; }

            for (int i = 0; i < eu.Count; i++)
            {
                if (eu[i] != ev[i] && ev[i] != root && ew[i] < minIn[ev[i]])
                {
                    minIn[ev[i]] = ew[i];
                    minEdge[ev[i]] = eu[i];
                }
            }

            for (int i = 0; i < n; i++)
            {
                if (i != root && minIn[i] == INF) return -1;
            }

            int[] comp = new int[n];
            for (int i = 0; i < n; i++) comp[i] = -1;
            comp[root] = root;
            int numCycles = 0;

            for (int i = 0; i < n; i++)
            {
                if (i != root) res += minIn[i];
            }

            int[] visited = new int[n];
            for (int i = 0; i < n; i++) visited[i] = -1;

            for (int i = 0; i < n; i++)
            {
                if (i == root) continue;
                int v = i;
                while (visited[v] == -1 && comp[v] == -1 && v != root)
                {
                    visited[v] = i;
                    v = minEdge[v];
                }
                if (v != root && comp[v] == -1 && visited[v] == i)
                {
                    int u = v;
                    do
                    {
                        comp[u] = numCycles;
                        u = minEdge[u];
                    } while (u != v);
                    numCycles++;
                }
            }

            if (numCycles == 0) break;

            for (int i = 0; i < n; i++)
            {
                if (comp[i] == -1) comp[i] = numCycles++;
            }

            var neu = new List<int>();
            var nev = new List<int>();
            var newW = new List<int>();
            for (int i = 0; i < eu.Count; i++)
            {
                int nu = comp[eu[i]], nv = comp[ev[i]];
                if (nu != nv)
                {
                    neu.Add(nu);
                    nev.Add(nv);
                    newW.Add(ew[i] - minIn[ev[i]]);
                }
            }

            eu = neu; ev = nev; ew = newW;
            root = comp[root];
            n = numCycles;
        }

        return res;
    }
}
