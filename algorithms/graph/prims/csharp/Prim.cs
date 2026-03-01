using System;
using System.Collections.Generic;
using System.Linq;

/// <summary>
/// Prim's algorithm to find the Minimum Spanning Tree (MST) total weight.
/// </summary>
public class Prim
{
    public static int PrimMST(int numVertices, Dictionary<int, List<int[]>> adjList)
    {
        bool[] inMST = new bool[numVertices];
        int[] key = new int[numVertices];
        for (int i = 0; i < numVertices; i++)
            key[i] = int.MaxValue;
        key[0] = 0;

        int totalWeight = 0;

        for (int count = 0; count < numVertices; count++)
        {
            // Find minimum key vertex not in MST
            int u = -1;
            int minKey = int.MaxValue;
            for (int i = 0; i < numVertices; i++)
            {
                if (!inMST[i] && key[i] < minKey)
                {
                    minKey = key[i];
                    u = i;
                }
            }

            if (u == -1) break;

            inMST[u] = true;
            totalWeight += key[u];

            // Update keys of adjacent vertices
            if (adjList.ContainsKey(u))
            {
                foreach (var edge in adjList[u])
                {
                    int v = edge[0];
                    int w = edge[1];
                    if (!inMST[v] && w < key[v])
                    {
                        key[v] = w;
                    }
                }
            }
        }

        return totalWeight;
    }

    public static void Main(string[] args)
    {
        var adjList = new Dictionary<int, List<int[]>>
        {
            { 0, new List<int[]> { new[] {1, 10}, new[] {2, 6}, new[] {3, 5} } },
            { 1, new List<int[]> { new[] {0, 10}, new[] {3, 15} } },
            { 2, new List<int[]> { new[] {0, 6}, new[] {3, 4} } },
            { 3, new List<int[]> { new[] {0, 5}, new[] {1, 15}, new[] {2, 4} } }
        };

        int result = PrimMST(4, adjList);
        Console.WriteLine("MST total weight: " + result);
    }
}
