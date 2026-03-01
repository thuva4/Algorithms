package algorithms.graph.chromaticnumber;

public class ChromaticNumber {
    public int solve(int[] arr) {
        if (arr == null || arr.length < 2) return 0;
        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 2 * m) return 0;
        if (n == 0) return 0;

        boolean[][] adj = new boolean[n][n];
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                adj[u][v] = true;
                adj[v][u] = true;
            }
        }

        int[] color = new int[n];

        for (int k = 1; k <= n; k++) {
            if (graphColoringUtil(0, n, k, color, adj)) {
                return k;
            }
        }

        return n;
    }

    private boolean isSafe(int u, int c, int n, int[] color, boolean[][] adj) {
        for (int v = 0; v < n; v++) {
            if (adj[u][v] && color[v] == c) {
                return false;
            }
        }
        return true;
    }

    private boolean graphColoringUtil(int u, int n, int k, int[] color, boolean[][] adj) {
        if (u == n) return true;

        for (int c = 1; c <= k; c++) {
            if (isSafe(u, c, n, color, adj)) {
                color[u] = c;
                if (graphColoringUtil(u + 1, n, k, color, adj)) {
                    return true;
                }
                color[u] = 0;
            }
        }
        return false;
    }
}
