import java.util.*;

public class GraphCycleDetection {

    public static int graphCycleDetection(int[] arr) {
        int n = arr[0], m = arr[1];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            adj.get(arr[2 + 2 * i]).add(arr[2 + 2 * i + 1]);
        }
        int[] color = new int[n]; // 0=white, 1=gray, 2=black
        for (int v = 0; v < n; v++) {
            if (color[v] == 0 && dfs(v, adj, color)) return 1;
        }
        return 0;
    }

    private static boolean dfs(int v, List<List<Integer>> adj, int[] color) {
        color[v] = 1;
        for (int w : adj.get(v)) {
            if (color[w] == 1) return true;
            if (color[w] == 0 && dfs(w, adj, color)) return true;
        }
        color[v] = 2;
        return false;
    }
}
