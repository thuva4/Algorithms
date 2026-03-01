using System.Collections.Generic;

public class EulerPath
{
    public static int Run(int[] arr)
    {
        int n = arr[0], m = arr[1];
        if (n == 0) return 1;
        List<int>[] adj = new List<int>[n];
        int[] degree = new int[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[2+2*i], v = arr[3+2*i];
            adj[u].Add(v); adj[v].Add(u);
            degree[u]++; degree[v]++;
        }
        foreach (int d in degree) if (d % 2 != 0) return 0;
        int start = -1;
        for (int i = 0; i < n; i++) if (degree[i] > 0) { start = i; break; }
        if (start == -1) return 1;
        bool[] visited = new bool[n];
        Stack<int> stack = new Stack<int>();
        stack.Push(start); visited[start] = true;
        while (stack.Count > 0)
        {
            int v = stack.Pop();
            foreach (int u in adj[v]) if (!visited[u]) { visited[u] = true; stack.Push(u); }
        }
        for (int i = 0; i < n; i++) if (degree[i] > 0 && !visited[i]) return 0;
        return 1;
    }
}
