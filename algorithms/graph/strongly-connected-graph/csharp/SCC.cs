using System;
using System.Collections.Generic;

/// <summary>
/// Kosaraju's algorithm to find strongly connected components.
/// </summary>
public class SCC
{
    public static List<List<int>> FindSCCs(Dictionary<int, List<int>> adjList)
    {
        int numNodes = adjList.Count;
        var visited = new HashSet<int>();
        var finishOrder = new List<int>();

        // First DFS pass
        for (int i = 0; i < numNodes; i++)
        {
            if (!visited.Contains(i))
                Dfs1(adjList, i, visited, finishOrder);
        }

        // Build reverse graph
        var revAdj = new Dictionary<int, List<int>>();
        foreach (var node in adjList.Keys)
            revAdj[node] = new List<int>();
        foreach (var kvp in adjList)
        {
            foreach (int neighbor in kvp.Value)
            {
                if (!revAdj.ContainsKey(neighbor))
                    revAdj[neighbor] = new List<int>();
                revAdj[neighbor].Add(kvp.Key);
            }
        }

        // Second DFS pass on reversed graph
        visited.Clear();
        var components = new List<List<int>>();

        for (int i = finishOrder.Count - 1; i >= 0; i--)
        {
            int node = finishOrder[i];
            if (!visited.Contains(node))
            {
                var component = new List<int>();
                Dfs2(revAdj, node, visited, component);
                components.Add(component);
            }
        }

        return components;
    }

    private static void Dfs1(Dictionary<int, List<int>> adjList, int node,
        HashSet<int> visited, List<int> finishOrder)
    {
        visited.Add(node);
        if (adjList.ContainsKey(node))
        {
            foreach (int neighbor in adjList[node])
            {
                if (!visited.Contains(neighbor))
                    Dfs1(adjList, neighbor, visited, finishOrder);
            }
        }
        finishOrder.Add(node);
    }

    private static void Dfs2(Dictionary<int, List<int>> revAdj, int node,
        HashSet<int> visited, List<int> component)
    {
        visited.Add(node);
        component.Add(node);
        if (revAdj.ContainsKey(node))
        {
            foreach (int neighbor in revAdj[node])
            {
                if (!visited.Contains(neighbor))
                    Dfs2(revAdj, neighbor, visited, component);
            }
        }
    }

    public static void Main(string[] args)
    {
        var adjList = new Dictionary<int, List<int>>
        {
            { 0, new List<int> { 1 } },
            { 1, new List<int> { 2 } },
            { 2, new List<int> { 0, 3 } },
            { 3, new List<int> { 4 } },
            { 4, new List<int> { 3 } }
        };

        var components = FindSCCs(adjList);
        Console.WriteLine("SCCs:");
        foreach (var comp in components)
            Console.WriteLine(string.Join(", ", comp));
    }
}
