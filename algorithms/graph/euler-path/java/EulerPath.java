import java.util.*;

public class EulerPath {
    public static int eulerPath(int[] arr) {
        int n = arr[0], m = arr[1];
        if (n == 0) return 1;
        List<List<Integer>> adj = new ArrayList<>();
        int[] degree = new int[n];
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2*i], v = arr[3 + 2*i];
            adj.get(u).add(v);
            adj.get(v).add(u);
            degree[u]++;
            degree[v]++;
        }
        for (int d : degree) if (d % 2 != 0) return 0;
        int start = -1;
        for (int i = 0; i < n; i++) if (degree[i] > 0) { start = i; break; }
        if (start == -1) return 1;
        boolean[] visited = new boolean[n];
        Stack<Integer> stack = new Stack<>();
        stack.push(start);
        visited[start] = true;
        while (!stack.isEmpty()) {
            int v = stack.pop();
            for (int u : adj.get(v)) if (!visited[u]) { visited[u] = true; stack.push(u); }
        }
        for (int i = 0; i < n; i++) if (degree[i] > 0 && !visited[i]) return 0;
        return 1;
    }
}
