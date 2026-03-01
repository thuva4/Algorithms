import java.util.*;

public class TopologicalSortAll {

    private static List<List<Integer>> adj;
    private static int[] inDeg;
    private static boolean[] visited;
    private static int n, count;

    public static int topologicalSortAll(int[] arr) {
        n = arr[0];
        int m = arr[1];
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        inDeg = new int[n];
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
            adj.get(u).add(v);
            inDeg[v]++;
        }
        visited = new boolean[n];
        count = 0;
        backtrack(0);
        return count;
    }

    private static void backtrack(int placed) {
        if (placed == n) { count++; return; }
        for (int v = 0; v < n; v++) {
            if (!visited[v] && inDeg[v] == 0) {
                visited[v] = true;
                for (int w : adj.get(v)) inDeg[w]--;
                backtrack(placed + 1);
                visited[v] = false;
                for (int w : adj.get(v)) inDeg[w]++;
            }
        }
    }
}
