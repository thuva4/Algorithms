import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TarjansOfflineLCA {
    public static int[] offlineLca(int n, int[][] edges, int[][] queries) {
        if (n <= 0) {
            return new int[0];
        }

        List<List<Integer>> adjacency = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adjacency.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            adjacency.get(edge[0]).add(edge[1]);
            adjacency.get(edge[1]).add(edge[0]);
        }

        int[] parent = new int[n];
        int[] depth = new int[n];
        Arrays.fill(parent, -1);
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(0);
        parent[0] = 0;

        while (!queue.isEmpty()) {
            int node = queue.removeFirst();
            for (int next : adjacency.get(node)) {
                if (parent[next] != -1) {
                    continue;
                }
                parent[next] = node;
                depth[next] = depth[node] + 1;
                queue.addLast(next);
            }
        }

        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            result[i] = lca(queries[i][0], queries[i][1], parent, depth);
        }
        return result;
    }

    private static int lca(int a, int b, int[] parent, int[] depth) {
        int x = a;
        int y = b;
        while (depth[x] > depth[y]) {
            x = parent[x];
        }
        while (depth[y] > depth[x]) {
            y = parent[y];
        }
        while (x != y) {
            x = parent[x];
            y = parent[y];
        }
        return x;
    }
}
