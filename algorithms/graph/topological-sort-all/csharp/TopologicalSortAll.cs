using System;
using System.Collections.Generic;

public class TopologicalSortAll
{
    private static List<int>[] adj;
    private static int[] inDeg;
    private static bool[] visited;
    private static int n, count;

    public static int Solve(int[] arr)
    {
        n = arr[0]; int m = arr[1];
        adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        inDeg = new int[n];
        for (int i = 0; i < m; i++)
        {
            int u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
            adj[u].Add(v); inDeg[v]++;
        }
        visited = new bool[n];
        count = 0;
        Backtrack(0);
        return count;
    }

    private static void Backtrack(int placed)
    {
        if (placed == n) { count++; return; }
        for (int v = 0; v < n; v++)
        {
            if (!visited[v] && inDeg[v] == 0)
            {
                visited[v] = true;
                foreach (int w in adj[v]) inDeg[w]--;
                Backtrack(placed + 1);
                visited[v] = false;
                foreach (int w in adj[v]) inDeg[w]++;
            }
        }
    }
}
