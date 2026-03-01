using System;
using System.Collections.Generic;
using System.Linq;

class DpOnTrees {
    public static int Solve(int n, int[] values, int[][] edges) {
        if (n == 0) return 0;
        if (n == 1) return values[0];

        var adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        foreach (var e in edges) {
            adj[e[0]].Add(e[1]);
            adj[e[1]].Add(e[0]);
        }

        int[] dp = new int[n];
        int[] parent = new int[n];
        bool[] visited = new bool[n];
        Array.Fill(parent, -1);

        var order = new List<int>();
        var queue = new Queue<int>();
        queue.Enqueue(0);
        visited[0] = true;
        while (queue.Count > 0) {
            int node = queue.Dequeue();
            order.Add(node);
            foreach (int child in adj[node]) {
                if (!visited[child]) {
                    visited[child] = true;
                    parent[child] = node;
                    queue.Enqueue(child);
                }
            }
        }

        for (int i = order.Count - 1; i >= 0; i--) {
            int node = order[i];
            int bestChild = 0;
            foreach (int child in adj[node]) {
                if (child != parent[node]) {
                    bestChild = Math.Max(bestChild, dp[child]);
                }
            }
            dp[node] = values[node] + bestChild;
        }

        return dp.Max();
    }

    static void Main(string[] args) {
        int n = int.Parse(Console.ReadLine().Trim());
        int[] values = Console.ReadLine().Trim().Split(' ').Select(int.Parse).ToArray();
        int[][] edges = new int[Math.Max(0, n - 1)][];
        for (int i = 0; i < n - 1; i++) {
            edges[i] = Console.ReadLine().Trim().Split(' ').Select(int.Parse).ToArray();
        }
        Console.WriteLine(Solve(n, values, edges));
    }
}
