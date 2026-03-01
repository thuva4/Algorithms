import java.util.*;

public class KosarajusScc {

    public static int kosarajusScc(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        List<List<Integer>> adj = new ArrayList<>();
        List<List<Integer>> radj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
            radj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj.get(u).add(v);
            radj.get(v).add(u);
        }

        boolean[] visited = new boolean[n];
        List<Integer> order = new ArrayList<>();

        for (int v = 0; v < n; v++) {
            if (!visited[v]) dfs1(v, adj, visited, order);
        }

        visited = new boolean[n];
        int sccCount = 0;

        for (int i = order.size() - 1; i >= 0; i--) {
            int v = order.get(i);
            if (!visited[v]) {
                dfs2(v, radj, visited);
                sccCount++;
            }
        }

        return sccCount;
    }

    private static void dfs1(int v, List<List<Integer>> adj, boolean[] visited, List<Integer> order) {
        visited[v] = true;
        for (int w : adj.get(v)) {
            if (!visited[w]) dfs1(w, adj, visited, order);
        }
        order.add(v);
    }

    private static void dfs2(int v, List<List<Integer>> radj, boolean[] visited) {
        visited[v] = true;
        for (int w : radj.get(v)) {
            if (!visited[w]) dfs2(w, radj, visited);
        }
    }
}
