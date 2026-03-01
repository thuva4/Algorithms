using System;
using System.Collections.Generic;

/// <summary>
/// Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
/// </summary>
public class EdmondsKarp
{
    public static int MaxFlow(int[,] capacity, int source, int sink)
    {
        if (source == sink) return 0;

        int n = capacity.GetLength(0);
        int[,] residual = new int[n, n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                residual[i, j] = capacity[i, j];

        int totalFlow = 0;

        while (true)
        {
            // BFS to find augmenting path
            int[] parent = new int[n];
            bool[] visited = new bool[n];
            for (int i = 0; i < n; i++) parent[i] = -1;

            var queue = new Queue<int>();
            queue.Enqueue(source);
            visited[source] = true;

            while (queue.Count > 0 && !visited[sink])
            {
                int u = queue.Dequeue();
                for (int v = 0; v < n; v++)
                {
                    if (!visited[v] && residual[u, v] > 0)
                    {
                        visited[v] = true;
                        parent[v] = u;
                        queue.Enqueue(v);
                    }
                }
            }

            if (!visited[sink]) break;

            // Find minimum capacity along path
            int pathFlow = int.MaxValue;
            for (int v = sink; v != source; v = parent[v])
                pathFlow = Math.Min(pathFlow, residual[parent[v], v]);

            // Update residual capacities
            for (int v = sink; v != source; v = parent[v])
            {
                residual[parent[v], v] -= pathFlow;
                residual[v, parent[v]] += pathFlow;
            }

            totalFlow += pathFlow;
        }

        return totalFlow;
    }

    public static void Main(string[] args)
    {
        int[,] capacity = {
            {0, 10, 10, 0, 0, 0},
            {0, 0, 2, 4, 8, 0},
            {0, 0, 0, 0, 9, 0},
            {0, 0, 0, 0, 0, 10},
            {0, 0, 0, 6, 0, 10},
            {0, 0, 0, 0, 0, 0}
        };

        int result = MaxFlow(capacity, 0, 5);
        Console.WriteLine("Maximum flow: " + result);
    }
}
