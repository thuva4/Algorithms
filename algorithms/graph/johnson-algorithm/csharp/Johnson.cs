using System;
using System.Collections.Generic;

/// <summary>
/// Johnson's algorithm for all-pairs shortest paths.
/// </summary>
public class Johnson
{
    public static Dictionary<int, Dictionary<int, double>> JohnsonAlgorithm(int numVertices, int[][] edges)
    {
        // Add virtual node edges
        var allEdges = new List<int[]>(edges);
        for (int i = 0; i < numVertices; i++)
            allEdges.Add(new[] { numVertices, i, 0 });

        // Bellman-Ford from virtual node
        double[] h = new double[numVertices + 1];
        for (int i = 0; i <= numVertices; i++) h[i] = double.PositiveInfinity;
        h[numVertices] = 0;

        for (int i = 0; i < numVertices; i++)
        {
            foreach (var e in allEdges)
            {
                if (h[e[0]] != double.PositiveInfinity && h[e[0]] + e[2] < h[e[1]])
                    h[e[1]] = h[e[0]] + e[2];
            }
        }

        foreach (var e in allEdges)
        {
            if (h[e[0]] != double.PositiveInfinity && h[e[0]] + e[2] < h[e[1]])
                return null; // Negative cycle
        }

        // Reweight edges
        var adjList = new Dictionary<int, List<int[]>>();
        for (int i = 0; i < numVertices; i++) adjList[i] = new List<int[]>();
        foreach (var e in edges)
        {
            int newWeight = (int)(e[2] + h[e[0]] - h[e[1]]);
            adjList[e[0]].Add(new[] { e[1], newWeight });
        }

        // Run Dijkstra from each vertex
        var result = new Dictionary<int, Dictionary<int, double>>();
        for (int u = 0; u < numVertices; u++)
        {
            double[] dist = Dijkstra(numVertices, adjList, u);
            var distances = new Dictionary<int, double>();
            for (int v = 0; v < numVertices; v++)
            {
                distances[v] = dist[v] == double.PositiveInfinity
                    ? double.PositiveInfinity
                    : dist[v] - h[u] + h[v];
            }
            result[u] = distances;
        }

        return result;
    }

    private static double[] Dijkstra(int n, Dictionary<int, List<int[]>> adjList, int src)
    {
        double[] dist = new double[n];
        bool[] visited = new bool[n];
        for (int i = 0; i < n; i++) dist[i] = double.PositiveInfinity;
        dist[src] = 0;

        for (int count = 0; count < n; count++)
        {
            int u = -1;
            double minDist = double.PositiveInfinity;
            for (int i = 0; i < n; i++)
            {
                if (!visited[i] && dist[i] < minDist)
                {
                    minDist = dist[i];
                    u = i;
                }
            }
            if (u == -1) break;
            visited[u] = true;

            foreach (var edge in adjList.GetValueOrDefault(u, new List<int[]>()))
            {
                int v = edge[0], w = edge[1];
                if (!visited[v] && dist[u] + w < dist[v])
                    dist[v] = dist[u] + w;
            }
        }
        return dist;
    }

    public static void Main(string[] args)
    {
        int[][] edges = { new[] {0,1,1}, new[] {1,2,2}, new[] {2,3,3}, new[] {0,3,10} };
        var result = JohnsonAlgorithm(4, edges);

        if (result == null)
            Console.WriteLine("Negative cycle detected");
        else
            foreach (var kvp in result)
                Console.WriteLine($"From {kvp.Key}: {string.Join(", ", kvp.Value)}");
    }
}
