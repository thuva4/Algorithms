using System;
using System.Collections.Generic;

/// <summary>
/// Longest path in a DAG using topological sort.
/// </summary>
public class LongestPath
{
    public static Dictionary<int, double> FindLongestPath(
        Dictionary<int, List<int[]>> adjList, int startNode)
    {
        int numNodes = adjList.Count;
        var visited = new HashSet<int>();
        var topoOrder = new List<int>();

        for (int i = 0; i < numNodes; i++)
        {
            if (!visited.Contains(i))
                Dfs(adjList, i, visited, topoOrder);
        }

        double[] dist = new double[numNodes];
        for (int i = 0; i < numNodes; i++)
            dist[i] = double.NegativeInfinity;
        dist[startNode] = 0;

        for (int i = topoOrder.Count - 1; i >= 0; i--)
        {
            int u = topoOrder[i];
            if (dist[u] != double.NegativeInfinity && adjList.ContainsKey(u))
            {
                foreach (var edge in adjList[u])
                {
                    int v = edge[0], w = edge[1];
                    if (dist[u] + w > dist[v])
                        dist[v] = dist[u] + w;
                }
            }
        }

        var result = new Dictionary<int, double>();
        for (int i = 0; i < numNodes; i++)
            result[i] = dist[i];
        return result;
    }

    private static void Dfs(Dictionary<int, List<int[]>> adjList, int node,
        HashSet<int> visited, List<int> topoOrder)
    {
        visited.Add(node);
        if (adjList.ContainsKey(node))
        {
            foreach (var edge in adjList[node])
            {
                if (!visited.Contains(edge[0]))
                    Dfs(adjList, edge[0], visited, topoOrder);
            }
        }
        topoOrder.Add(node);
    }

    public static void Main(string[] args)
    {
        var adjList = new Dictionary<int, List<int[]>>
        {
            { 0, new List<int[]> { new[] {1, 3}, new[] {2, 6} } },
            { 1, new List<int[]> { new[] {3, 4}, new[] {2, 4} } },
            { 2, new List<int[]> { new[] {3, 2} } },
            { 3, new List<int[]>() }
        };

        var result = FindLongestPath(adjList, 0);
        foreach (var kvp in result)
            Console.WriteLine($"Node {kvp.Key}: {kvp.Value}");
    }
}
