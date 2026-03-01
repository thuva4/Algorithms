import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class HeavyLightDecomposition {
    @SuppressWarnings("unchecked")
    public static int[] hldPathQuery(int n, int[][] edges, int[] values, List<Map<Object, Object>> queries) {
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

        int[] result = new int[queries.size()];
        for (int i = 0; i < queries.size(); i++) {
            Map<Object, Object> query = queries.get(i);
            String type = String.valueOf(query.get("type"));
            int u = ((Number) query.get("u")).intValue();
            int v = ((Number) query.get("v")).intValue();
            List<Integer> pathValues = collectPathValues(u, v, parent, depth, values);
            if ("max".equals(type)) {
                int best = Integer.MIN_VALUE;
                for (int value : pathValues) {
                    best = Math.max(best, value);
                }
                result[i] = best;
            } else {
                int sum = 0;
                for (int value : pathValues) {
                    sum += value;
                }
                result[i] = sum;
            }
        }

        return result;
    }

    private static List<Integer> collectPathValues(int start, int end, int[] parent, int[] depth, int[] values) {
        int u = start;
        int v = end;
        List<Integer> up = new ArrayList<>();
        List<Integer> down = new ArrayList<>();

        while (depth[u] > depth[v]) {
            up.add(values[u]);
            u = parent[u];
        }
        while (depth[v] > depth[u]) {
            down.add(values[v]);
            v = parent[v];
        }
        while (u != v) {
            up.add(values[u]);
            down.add(values[v]);
            u = parent[u];
            v = parent[v];
        }
        up.add(values[u]);
        for (int i = down.size() - 1; i >= 0; i--) {
            up.add(down.get(i));
        }
        return up;
    }
}
