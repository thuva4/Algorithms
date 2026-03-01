using System;
using System.Collections.Generic;
using System.Linq;

/// <summary>
/// A* search algorithm to find shortest path from start to goal.
/// </summary>
public class AStar
{
    public static (List<int> Path, double Cost) AStarSearch(
        Dictionary<int, List<int[]>> adjList,
        int start, int goal,
        Dictionary<int, int> heuristic)
    {
        if (start == goal)
            return (new List<int> { start }, 0);

        var gScore = new Dictionary<int, double>();
        var cameFrom = new Dictionary<int, int>();
        var closedSet = new HashSet<int>();

        foreach (var node in adjList.Keys)
            gScore[node] = double.PositiveInfinity;
        gScore[start] = 0;

        // Priority queue using sorted set: (fScore, node)
        var openSet = new SortedSet<(double fScore, int node)>();
        openSet.Add((heuristic.GetValueOrDefault(start, 0), start));

        while (openSet.Count > 0)
        {
            var current = openSet.Min;
            openSet.Remove(current);
            int currentNode = current.node;

            if (currentNode == goal)
            {
                var path = new List<int>();
                int node = goal;
                while (cameFrom.ContainsKey(node))
                {
                    path.Insert(0, node);
                    node = cameFrom[node];
                }
                path.Insert(0, node);
                return (path, gScore[goal]);
            }

            if (closedSet.Contains(currentNode)) continue;
            closedSet.Add(currentNode);

            if (!adjList.ContainsKey(currentNode)) continue;

            foreach (var edge in adjList[currentNode])
            {
                int neighbor = edge[0];
                int weight = edge[1];

                if (closedSet.Contains(neighbor)) continue;

                double tentativeG = gScore[currentNode] + weight;
                if (tentativeG < gScore.GetValueOrDefault(neighbor, double.PositiveInfinity))
                {
                    cameFrom[neighbor] = currentNode;
                    gScore[neighbor] = tentativeG;
                    double fScore = tentativeG + heuristic.GetValueOrDefault(neighbor, 0);
                    openSet.Add((fScore, neighbor));
                }
            }
        }

        return (new List<int>(), double.PositiveInfinity);
    }

    public static void Main(string[] args)
    {
        var adjList = new Dictionary<int, List<int[]>>
        {
            { 0, new List<int[]> { new[] {1, 1}, new[] {2, 4} } },
            { 1, new List<int[]> { new[] {2, 2}, new[] {3, 6} } },
            { 2, new List<int[]> { new[] {3, 3} } },
            { 3, new List<int[]>() }
        };

        var heuristic = new Dictionary<int, int> { {0, 5}, {1, 4}, {2, 2}, {3, 0} };
        var result = AStarSearch(adjList, 0, 3, heuristic);
        Console.WriteLine($"Path: [{string.Join(", ", result.Path)}], Cost: {result.Cost}");
    }
}
