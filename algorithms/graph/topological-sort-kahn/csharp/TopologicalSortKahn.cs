using System;
using System.Collections.Generic;

public class TopologicalSortKahn
{
    public static int[] Sort(int[] arr)
    {
        if (arr.Length < 2)
        {
            return new int[0];
        }

        int numVertices = arr[0];
        int numEdges = arr[1];

        List<int>[] adj = new List<int>[numVertices];
        for (int i = 0; i < numVertices; i++)
        {
            adj[i] = new List<int>();
        }

        int[] inDegree = new int[numVertices];

        for (int i = 0; i < numEdges; i++)
        {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj[u].Add(v);
            inDegree[v]++;
        }

        Queue<int> queue = new Queue<int>();
        for (int v = 0; v < numVertices; v++)
        {
            if (inDegree[v] == 0)
            {
                queue.Enqueue(v);
            }
        }

        List<int> result = new List<int>();
        while (queue.Count > 0)
        {
            int u = queue.Dequeue();
            result.Add(u);
            foreach (int v in adj[u])
            {
                inDegree[v]--;
                if (inDegree[v] == 0)
                {
                    queue.Enqueue(v);
                }
            }
        }

        if (result.Count == numVertices)
        {
            return result.ToArray();
        }
        return new int[0];
    }
}
