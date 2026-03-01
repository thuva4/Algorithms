using System;
using System.Collections.Generic;

public class IsBipartite
{
    public static int Solve(int[] arr)
    {
        int n = arr[0];
        int m = arr[1];
        var adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj[u].Add(v);
            adj[v].Add(u);
        }

        int[] color = new int[n];
        Array.Fill(color, -1);

        for (int start = 0; start < n; start++)
        {
            if (color[start] != -1) continue;
            color[start] = 0;
            var queue = new Queue<int>();
            queue.Enqueue(start);
            while (queue.Count > 0)
            {
                int u = queue.Dequeue();
                foreach (int v in adj[u])
                {
                    if (color[v] == -1)
                    {
                        color[v] = 1 - color[u];
                        queue.Enqueue(v);
                    }
                    else if (color[v] == color[u])
                    {
                        return 0;
                    }
                }
            }
        }

        return 1;
    }
}
