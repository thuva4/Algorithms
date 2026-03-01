import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PruferCode {
    public static int[] pruferEncode(int n, int[][] edges) {
        if (n <= 2) {
            return new int[0];
        }

        List<List<Integer>> adjacency = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adjacency.add(new ArrayList<>());
        }
        int[] degree = new int[n];

        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            adjacency.get(u).add(v);
            adjacency.get(v).add(u);
            degree[u]++;
            degree[v]++;
        }

        int[] result = new int[n - 2];
        for (int i = 0; i < n - 2; i++) {
            int leaf = 0;
            while (leaf < n && degree[leaf] != 1) {
                leaf++;
            }
            int neighbor = 0;
            for (int next : adjacency.get(leaf)) {
                if (degree[next] > 0) {
                    neighbor = next;
                    break;
                }
            }
            result[i] = neighbor;
            degree[leaf]--;
            degree[neighbor]--;
        }

        return result;
    }
}
