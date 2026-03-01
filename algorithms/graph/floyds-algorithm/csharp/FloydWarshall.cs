using System;

/// <summary>
/// Floyd-Warshall algorithm to find shortest paths between all pairs of vertices.
/// Uses a distance matrix as input.
/// </summary>
public class FloydWarshall
{
    public static double[,] FloydWarshallAlgorithm(double[,] matrix)
    {
        int n = matrix.GetLength(0);
        double[,] dist = new double[n, n];

        // Copy input matrix
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                dist[i, j] = matrix[i, j];
            }
        }

        // Floyd-Warshall
        for (int k = 0; k < n; k++)
        {
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    if (dist[i, k] != double.PositiveInfinity &&
                        dist[k, j] != double.PositiveInfinity &&
                        dist[i, k] + dist[k, j] < dist[i, j])
                    {
                        dist[i, j] = dist[i, k] + dist[k, j];
                    }
                }
            }
        }

        return dist;
    }

    public static void Main(string[] args)
    {
        double inf = double.PositiveInfinity;
        double[,] matrix = {
            { 0, 3, inf, 7 },
            { 8, 0, 2, inf },
            { 5, inf, 0, 1 },
            { 2, inf, inf, 0 }
        };

        double[,] result = FloydWarshallAlgorithm(matrix);

        int n = result.GetLength(0);
        Console.WriteLine("Shortest distance matrix:");
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (result[i, j] == inf)
                    Console.Write("INF\t");
                else
                    Console.Write(result[i, j] + "\t");
            }
            Console.WriteLine();
        }
    }
}
