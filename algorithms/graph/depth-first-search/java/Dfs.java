package algorithms.graph.depthfirstsearch;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Dfs {
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

        dfsRecursive(start, adj, visited, result);

        return result.stream().mapToInt(i -> i).toArray();
    }

    private void dfsRecursive(int u, List<Integer>[] adj, boolean[] visited, List<Integer> result) {
        visited[u] = true;
        result.add(u);

        for (int v : adj[u]) {
            if (!visited[v]) {
                dfsRecursive(v, adj, visited, result);
            }
        }
    }
}
