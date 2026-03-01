package algorithms.graph.allpairsshortestpath;

import java.util.Arrays;

public class AllPairsShortestPath {
    private static final int INF = 1000000000;

    public int solve(int[] arr) {
        if (arr == null || arr.length < 2) return -1;

        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 3 * m) return -1;
        if (n <= 0) return -1;
        if (n == 1) return 0;

        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], INF);
            dist[i][i] = 0;
        }

        for (int i = 0; i < m; i++) {
            int u = arr[2 + 3 * i];
            int v = arr[2 + 3 * i + 1];
            int w = arr[2 + 3 * i + 2];

            if (u >= 0 && u < n && v >= 0 && v < n) {
                dist[u][v] = Math.min(dist[u][v], w);
            }
        }

        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] != INF && dist[k][j] != INF) {
                        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }

        return (dist[0][n - 1] == INF) ? -1 : dist[0][n - 1];
    }
}
