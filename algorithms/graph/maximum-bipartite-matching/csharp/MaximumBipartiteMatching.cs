using System;
using System.Collections.Generic;

public class MaximumBipartiteMatching
{
    private static List<int>[] adj;
    private static int[] matchRight;

    public static int Solve(int[] arr)
    {
        int nLeft = arr[0], nRight = arr[1], m = arr[2];
        adj = new List<int>[nLeft];
        for (int i = 0; i < nLeft; i++) adj[i] = new List<int>();
        for (int i = 0; i < m; i++) adj[arr[3 + 2 * i]].Add(arr[3 + 2 * i + 1]);
        matchRight = new int[nRight];
        for (int i = 0; i < nRight; i++) matchRight[i] = -1;
        int result = 0;
        for (int u = 0; u < nLeft; u++)
        {
            bool[] visited = new bool[nRight];
            if (Dfs(u, visited)) result++;
        }
        return result;
    }

    private static bool Dfs(int u, bool[] visited)
    {
        foreach (int v in adj[u])
        {
            if (!visited[v])
            {
                visited[v] = true;
                if (matchRight[v] == -1 || Dfs(matchRight[v], visited))
                {
                    matchRight[v] = u; return true;
                }
            }
        }
        return false;
    }
}
