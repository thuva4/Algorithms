package algorithms.graph.bridges;

import java.util.ArrayList;
import java.util.List;

public class Bridges {
    private List<Integer>[] adj;
    private int[] dfn, low;
    private int timer, bridgeCount;

    public int solve(int[] arr) {
        if (arr == null || arr.length < 2) return 0;
        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 2 * m) return 0;

        adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                adj[u].add(v);
                adj[v].add(u);
            }
        }

        dfn = new int[n];
        low = new int[n];
        timer = 0;
        bridgeCount = 0;

        for (int i = 0; i < n; i++) {
            if (dfn[i] == 0) dfs(i, -1);
        }

        return bridgeCount;
    }

    private void dfs(int u, int p) {
        dfn[u] = low[u] = ++timer;

        for (int v : adj[u]) {
            if (v == p) continue;
            if (dfn[v] != 0) {
                low[u] = Math.min(low[u], dfn[v]);
            } else {
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > dfn[u]) {
                    bridgeCount++;
                }
            }
        }
    }
}
