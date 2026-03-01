import java.util.*;

public class IsBipartite {

    public static int isBipartite(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        int[] color = new int[n];
        Arrays.fill(color, -1);

        for (int start = 0; start < n; start++) {
            if (color[start] != -1) continue;
            color[start] = 0;
            Queue<Integer> queue = new LinkedList<>();
            queue.add(start);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        queue.add(v);
                    } else if (color[v] == color[u]) {
                        return 0;
                    }
                }
            }
        }

        return 1;
    }
}
