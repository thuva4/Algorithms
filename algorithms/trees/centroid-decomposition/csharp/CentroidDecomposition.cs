using System;
using System.Collections.Generic;

public class CentroidDecomposition
{
    static List<int>[] adj;
    static bool[] removed;
    static int[] subSize;

    static void GetSubSize(int v, int parent) {
        subSize[v] = 1;
        foreach (int u in adj[v])
            if (u != parent && !removed[u]) { GetSubSize(u, v); subSize[v] += subSize[u]; }
    }

    static int GetCentroid(int v, int parent, int treeSize) {
        foreach (int u in adj[v])
            if (u != parent && !removed[u] && subSize[u] > treeSize / 2)
                return GetCentroid(u, v, treeSize);
        return v;
    }

    static int Decompose(int v, int depth) {
        GetSubSize(v, -1);
        int centroid = GetCentroid(v, -1, subSize[v]);
        removed[centroid] = true;
        int maxDepth = depth;
        foreach (int u in adj[centroid])
            if (!removed[u]) { int r = Decompose(u, depth + 1); if (r > maxDepth) maxDepth = r; }
        removed[centroid] = false;
        return maxDepth;
    }

    public static int Solve(int[] arr)
    {
        int idx = 0;
        int n = arr[idx++];
        if (n <= 1) return 0;

        adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        int m = (arr.Length - 1) / 2;
        for (int i = 0; i < m; i++) {
            int u = arr[idx++], v = arr[idx++];
            adj[u].Add(v); adj[v].Add(u);
        }
        removed = new bool[n];
        subSize = new int[n];
        return Decompose(0, 0);
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 4, 0, 1, 1, 2, 2, 3 }));
        Console.WriteLine(Solve(new int[] { 5, 0, 1, 0, 2, 0, 3, 0, 4 }));
        Console.WriteLine(Solve(new int[] { 1 }));
        Console.WriteLine(Solve(new int[] { 7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6 }));
    }
}
