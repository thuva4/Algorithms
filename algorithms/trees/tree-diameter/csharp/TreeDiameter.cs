using System;
using System.Collections.Generic;

public class TreeDiameter
{
    public static int Solve(int[] arr)
    {
        int idx = 0;
        int n = arr[idx++];
        if (n <= 1) return 0;

        var adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        int m = (arr.Length - 1) / 2;
        for (int i = 0; i < m; i++)
        {
            int u = arr[idx++], v = arr[idx++];
            adj[u].Add(v); adj[v].Add(u);
        }

        (int farthest, int dist) Bfs(int start)
        {
            int[] d = new int[n];
            Array.Fill(d, -1);
            d[start] = 0;
            var queue = new Queue<int>();
            queue.Enqueue(start);
            int far = start;
            while (queue.Count > 0)
            {
                int node = queue.Dequeue();
                foreach (int nb in adj[node])
                {
                    if (d[nb] == -1)
                    {
                        d[nb] = d[node] + 1;
                        queue.Enqueue(nb);
                        if (d[nb] > d[far]) far = nb;
                    }
                }
            }
            return (far, d[far]);
        }

        var (u, _) = Bfs(0);
        var (_, diameter) = Bfs(u);
        return diameter;
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 4, 0, 1, 1, 2, 2, 3 }));
        Console.WriteLine(Solve(new int[] { 5, 0, 1, 0, 2, 0, 3, 0, 4 }));
        Console.WriteLine(Solve(new int[] { 2, 0, 1 }));
        Console.WriteLine(Solve(new int[] { 1 }));
    }
}
