public class FordFulkerson {
    private static int[][] cap;
    private static int n;

    private static int dfs(int u, int sink, int flow, boolean[] visited) {
        if (u == sink) return flow;
        visited[u] = true;
        for (int v = 0; v < n; v++) {
            if (!visited[v] && cap[u][v] > 0) {
                int d = dfs(v, sink, Math.min(flow, cap[u][v]), visited);
                if (d > 0) { cap[u][v] -= d; cap[v][u] += d; return d; }
            }
        }
        return 0;
    }

    public static int fordFulkerson(int[] arr) {
        n = arr[0]; int m = arr[1]; int src = arr[2]; int sink = arr[3];
        cap = new int[n][n];
        for (int i = 0; i < m; i++) cap[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i];
        int maxFlow = 0;
        while (true) {
            boolean[] visited = new boolean[n];
            int flow = dfs(src, sink, Integer.MAX_VALUE, visited);
            if (flow == 0) break;
            maxFlow += flow;
        }
        return maxFlow;
    }
}
