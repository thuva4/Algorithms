import java.util.*;

public class MaxFlowMinCut {
    public static int maxFlowMinCut(int[] arr) {
        int n = arr[0], m = arr[1], src = arr[2], sink = arr[3];
        int[][] cap = new int[n][n];
        for (int i = 0; i < m; i++) cap[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i];
        int maxFlow = 0;
        int[] parent = new int[n];
        while (true) {
            Arrays.fill(parent, -1);
            parent[src] = src;
            Queue<Integer> q = new LinkedList<>();
            q.add(src);
            while (!q.isEmpty() && parent[sink] == -1) {
                int u = q.poll();
                for (int v = 0; v < n; v++) {
                    if (parent[v] == -1 && cap[u][v] > 0) {
                        parent[v] = u;
                        q.add(v);
                    }
                }
            }
            if (parent[sink] == -1) break;
            int flow = Integer.MAX_VALUE;
            for (int v = sink; v != src; v = parent[v]) flow = Math.min(flow, cap[parent[v]][v]);
            for (int v = sink; v != src; v = parent[v]) {
                cap[parent[v]][v] -= flow;
                cap[v][parent[v]] += flow;
            }
            maxFlow += flow;
        }
        return maxFlow;
    }
}
