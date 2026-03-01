using System;
using System.Collections.Generic;

public class LowestCommonAncestor
{
    public static int Solve(int[] arr)
    {
        int idx = 0;
        int n = arr[idx++];
        int root = arr[idx++];

        var adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        for (int i = 0; i < n - 1; i++)
        {
            int u = arr[idx++], v = arr[idx++];
            adj[u].Add(v); adj[v].Add(u);
        }
        int qa = arr[idx++], qb = arr[idx++];

        int LOG = 1;
        while ((1 << LOG) < n) LOG++;

        int[] depth = new int[n];
        int[,] up = new int[LOG, n];
        for (int k = 0; k < LOG; k++)
            for (int i = 0; i < n; i++) up[k, i] = -1;

        bool[] visited = new bool[n];
        visited[root] = true;
        up[0, root] = root;
        var queue = new Queue<int>();
        queue.Enqueue(root);
        while (queue.Count > 0)
        {
            int v = queue.Dequeue();
            foreach (int u in adj[v])
            {
                if (!visited[u])
                {
                    visited[u] = true;
                    depth[u] = depth[v] + 1;
                    up[0, u] = v;
                    queue.Enqueue(u);
                }
            }
        }

        for (int k = 1; k < LOG; k++)
            for (int v = 0; v < n; v++)
                up[k, v] = up[k - 1, up[k - 1, v]];

        int a = qa, b = qb;
        if (depth[a] < depth[b]) { int t = a; a = b; b = t; }
        int diff = depth[a] - depth[b];
        for (int k = 0; k < LOG; k++)
            if (((diff >> k) & 1) == 1) a = up[k, a];
        if (a == b) return a;
        for (int k = LOG - 1; k >= 0; k--)
            if (up[k, a] != up[k, b]) { a = up[k, a]; b = up[k, b]; }
        return up[0, a];
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2 }));
        Console.WriteLine(Solve(new int[] { 5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3 }));
        Console.WriteLine(Solve(new int[] { 3, 0, 0, 1, 0, 2, 2, 2 }));
        Console.WriteLine(Solve(new int[] { 5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4 }));
    }
}
