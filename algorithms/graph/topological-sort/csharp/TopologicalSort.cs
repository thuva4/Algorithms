using System;
using System.Collections.Generic;

/// <summary>
/// Topological sort of a directed acyclic graph using DFS.
/// </summary>
public class TopologicalSort
{
    public static List<int> Sort(Dictionary<int, List<int>> adjList)
    {
        var visited = new HashSet<int>();
        var stack = new Stack<int>();

        // Process all nodes in order
        int numNodes = adjList.Count;
        for (int i = 0; i < numNodes; i++)
        {
            if (!visited.Contains(i))
            {
                Dfs(adjList, i, visited, stack);
            }
        }

        return new List<int>(stack);
    }

    private static void Dfs(Dictionary<int, List<int>> adjList, int node,
        HashSet<int> visited, Stack<int> stack)
    {
        visited.Add(node);

        foreach (int neighbor in adjList[node])
        {
            if (!visited.Contains(neighbor))
            {
                Dfs(adjList, neighbor, visited, stack);
            }
        }

        stack.Push(node);
    }

    public static void Main(string[] args)
    {
        var adjList = new Dictionary<int, List<int>>
        {
            { 0, new List<int> { 1, 2 } },
            { 1, new List<int> { 3 } },
            { 2, new List<int> { 3 } },
            { 3, new List<int>() }
        };

        var result = Sort(adjList);
        Console.WriteLine("Topological order: " + string.Join(", ", result));
    }
}
