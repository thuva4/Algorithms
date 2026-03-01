import java.util.*;

public class CountBridges {

    private static int timer;
    private static int bridgeCount;
    private static int[] disc, low, parent;
    private static List<List<Integer>> adj;

    public static int countBridges(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        disc = new int[n];
        low = new int[n];
        parent = new int[n];
        Arrays.fill(disc, -1);
        Arrays.fill(parent, -1);
        timer = 0;
        bridgeCount = 0;

        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) dfs(i);
        }

        return bridgeCount;
    }

    private static void dfs(int u) {
        disc[u] = timer;
        low[u] = timer;
        timer++;

        for (int v : adj.get(u)) {
            if (disc[v] == -1) {
                parent[v] = u;
                dfs(v);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) bridgeCount++;
            } else if (v != parent[u]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
}
