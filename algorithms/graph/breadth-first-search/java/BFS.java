package algorithms.graph.breadthfirstsearch;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class BFS {
    public static int[] bfs(int[] arr) {
        return new BFS().solve(arr);
    }

    public int[] solve(int[] arr) {
        if (arr == null || arr.length < 2) return new int[0];

        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 2 * m + 1) return new int[0];

        int start = arr[2 + 2 * m];
        if (start < 0 || start >= n) return new int[0];

        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                adj[u].add(v);
                adj[v].add(u);
            }
        }

        for (int i = 0; i < n; i++) {
            Collections.sort(adj[i]);
        }

        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new LinkedList<>();

        visited[start] = true;
        q.add(start);

        while (!q.isEmpty()) {
            int u = q.poll();
            result.add(u);

            for (int v : adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.add(v);
                }
            }
        }

        return result.stream().mapToInt(i -> i).toArray();
    }
}
