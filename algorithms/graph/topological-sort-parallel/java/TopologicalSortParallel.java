import java.util.*;

public class TopologicalSortParallel {

    public static int topologicalSortParallel(int[] data) {
        int n = data[0];
        int m = data[1];

        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[n];

        int idx = 2;
        for (int e = 0; e < m; e++) {
            int u = data[idx], v = data[idx + 1];
            adj.get(u).add(v);
            indegree[v]++;
            idx += 2;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) queue.add(i);
        }

        int rounds = 0;
        int processed = 0;

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int node = queue.poll();
                processed++;
                for (int neighbor : adj.get(node)) {
                    indegree[neighbor]--;
                    if (indegree[neighbor] == 0) {
                        queue.add(neighbor);
                    }
                }
            }
            rounds++;
        }

        return processed == n ? rounds : -1;
    }
}
