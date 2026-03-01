using System.Collections.Generic;

public class TopologicalSortParallel
{
    public static int Solve(int[] data)
    {
        int n = data[0];
        int m = data[1];

        List<int>[] adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        int[] indegree = new int[n];

        int idx = 2;
        for (int e = 0; e < m; e++)
        {
            int u = data[idx], v = data[idx + 1];
            adj[u].Add(v);
            indegree[v]++;
            idx += 2;
        }

        Queue<int> queue = new Queue<int>();
        for (int i = 0; i < n; i++)
        {
            if (indegree[i] == 0) queue.Enqueue(i);
        }

        int rounds = 0;
        int processed = 0;

        while (queue.Count > 0)
        {
            int size = queue.Count;
            for (int i = 0; i < size; i++)
            {
                int node = queue.Dequeue();
                processed++;
                foreach (int neighbor in adj[node])
                {
                    indegree[neighbor]--;
                    if (indegree[neighbor] == 0)
                    {
                        queue.Enqueue(neighbor);
                    }
                }
            }
            rounds++;
        }

        return processed == n ? rounds : -1;
    }
}
