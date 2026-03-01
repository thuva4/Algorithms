using System;
using System.Collections.Generic;

public class PrimsFibonacciHeap
{
    public static int Solve(int[] arr)
    {
        int n = arr[0], m = arr[1];
        var adj = new List<(int w, int v)>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<(int, int)>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[2+3*i], v = arr[2+3*i+1], w = arr[2+3*i+2];
            adj[u].Add((w, v)); adj[v].Add((w, u));
        }

        bool[] inMst = new bool[n];
        int[] key = new int[n];
        for (int i = 0; i < n; i++) key[i] = int.MaxValue;
        key[0] = 0;
        int total = 0;

        // Simple O(V^2) Prim's
        for (int iter = 0; iter < n; iter++)
        {
            int u = -1;
            for (int v = 0; v < n; v++)
            {
                if (!inMst[v] && (u == -1 || key[v] < key[u])) u = v;
            }
            inMst[u] = true;
            total += key[u];
            foreach (var (w, v) in adj[u])
            {
                if (!inMst[v] && w < key[v]) key[v] = w;
            }
        }

        return total;
    }
}
