using System;

public class HungarianAlgorithm
{
    /// <summary>
    /// Solve the assignment problem using the Hungarian algorithm in O(n^3).
    /// </summary>
    /// <param name="cost">n x n cost matrix</param>
    /// <returns>Tuple of (assignment array, total cost)</returns>
    public static (int[] Assignment, int TotalCost) Hungarian(int[,] cost)
    {
        int n = cost.GetLength(0);
        int INF = int.MaxValue / 2;

        int[] u = new int[n + 1];
        int[] v = new int[n + 1];
        int[] matchJob = new int[n + 1];

        for (int i = 1; i <= n; i++)
        {
            matchJob[0] = i;
            int j0 = 0;
            int[] dist = new int[n + 1];
            bool[] used = new bool[n + 1];
            int[] prevJob = new int[n + 1];

            for (int j = 0; j <= n; j++) dist[j] = INF;

            while (true)
            {
                used[j0] = true;
                int w = matchJob[j0];
                int delta = INF, j1 = -1;

                for (int j = 1; j <= n; j++)
                {
                    if (!used[j])
                    {
                        int cur = cost[w - 1, j - 1] - u[w] - v[j];
                        if (cur < dist[j])
                        {
                            dist[j] = cur;
                            prevJob[j] = j0;
                        }
                        if (dist[j] < delta)
                        {
                            delta = dist[j];
                            j1 = j;
                        }
                    }
                }

                for (int j = 0; j <= n; j++)
                {
                    if (used[j])
                    {
                        u[matchJob[j]] += delta;
                        v[j] -= delta;
                    }
                    else
                    {
                        dist[j] -= delta;
                    }
                }

                j0 = j1;
                if (matchJob[j0] == 0) break;
            }

            while (j0 != 0)
            {
                matchJob[j0] = matchJob[prevJob[j0]];
                j0 = prevJob[j0];
            }
        }

        int[] assignment = new int[n];
        for (int j = 1; j <= n; j++)
        {
            assignment[matchJob[j] - 1] = j - 1;
        }

        int totalCost = 0;
        for (int i = 0; i < n; i++)
        {
            totalCost += cost[i, assignment[i]];
        }

        return (assignment, totalCost);
    }

    public static void Main(string[] args)
    {
        int[,] cost = { { 9, 2, 7 }, { 6, 4, 3 }, { 5, 8, 1 } };
        var (assignment, totalCost) = Hungarian(cost);
        Console.WriteLine("Assignment: " + string.Join(", ", assignment));
        Console.WriteLine("Total cost: " + totalCost);
    }
}
