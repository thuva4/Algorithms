using System;
using System.Collections.Generic;
using System.Linq;

/// <summary>
/// Kruskal's algorithm to find the Minimum Spanning Tree (MST) total weight.
/// Uses Union-Find for cycle detection.
/// </summary>
public class Kruskal
{
    private static int[] parent;
    private static int[] rank;

    private static int Find(int x)
    {
        if (parent[x] != x)
            parent[x] = Find(parent[x]);
        return parent[x];
    }

    private static bool Union(int x, int y)
    {
        int rootX = Find(x);
        int rootY = Find(y);

        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY])
            parent[rootX] = rootY;
        else if (rank[rootX] > rank[rootY])
            parent[rootY] = rootX;
        else
        {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }

    public static int KruskalMST(int numVertices, int[][] edges)
    {
        parent = new int[numVertices];
        rank = new int[numVertices];
        for (int i = 0; i < numVertices; i++)
        {
            parent[i] = i;
            rank[i] = 0;
        }

        // Sort edges by weight
        var sortedEdges = edges.OrderBy(e => e[2]).ToArray();

        int totalWeight = 0;
        int edgesUsed = 0;

        foreach (var edge in sortedEdges)
        {
            if (edgesUsed >= numVertices - 1) break;

            if (Union(edge[0], edge[1]))
            {
                totalWeight += edge[2];
                edgesUsed++;
            }
        }

        return totalWeight;
    }

    public static void Main(string[] args)
    {
        int[][] edges = new int[][]
        {
            new int[] { 0, 1, 10 },
            new int[] { 0, 2, 6 },
            new int[] { 0, 3, 5 },
            new int[] { 1, 3, 15 },
            new int[] { 2, 3, 4 }
        };

        int result = KruskalMST(4, edges);
        Console.WriteLine("MST total weight: " + result);
    }
}
