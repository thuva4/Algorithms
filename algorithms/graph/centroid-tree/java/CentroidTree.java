package algorithms.graph.centroidtree;

import java.util.ArrayList;
import java.util.List;

public class CentroidTree {
    private List<Integer>[] adj;
    private int[] sz;
    private boolean[] removed;
    private int maxDepth;

    public int solve(int[] arr) {
        if (arr == null || arr.length < 1) return 0;
        int n = arr[0];

        if (n <= 1) return 0;
        if (arr.length < 1 + 2 * (n - 1)) return 0;

        adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < n - 1; i++) {
            int u = arr[1 + 2 * i];
            int v = arr[1 + 2 * i + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                adj[u].add(v);
                adj[v].add(u);
            }
        }

        sz = new int[n];
        removed = new boolean[n];
        maxDepth = 0;

        decompose(0, 0);

        return maxDepth;
    }

    private void getSize(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v != p && !removed[v]) {
                getSize(v, u);
                sz[u] += sz[v];
            }
        }
    }

    private int getCentroid(int u, int p, int total) {
        for (int v : adj[u]) {
            if (v != p && !removed[v] && sz[v] > total / 2) {
                return getCentroid(v, u, total);
            }
        }
        return u;
    }

    private void decompose(int u, int depth) {
        getSize(u, -1);
        int total = sz[u];
        int centroid = getCentroid(u, -1, total);

        maxDepth = Math.max(maxDepth, depth);

        removed[centroid] = true;

        for (int v : adj[centroid]) {
            if (!removed[v]) {
                decompose(v, depth + 1);
            }
        }
    }
}
