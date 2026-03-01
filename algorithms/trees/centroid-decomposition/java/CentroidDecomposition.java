import java.util.*;

public class CentroidDecomposition {

    static List<Integer>[] adj;
    static boolean[] removed;
    static int[] subtreeSize;

    static void getSubtreeSize(int v, int parent) {
        subtreeSize[v] = 1;
        for (int u : adj[v])
            if (u != parent && !removed[u]) {
                getSubtreeSize(u, v);
                subtreeSize[v] += subtreeSize[u];
            }
    }

    static int getCentroid(int v, int parent, int treeSize) {
        for (int u : adj[v])
            if (u != parent && !removed[u] && subtreeSize[u] > treeSize / 2)
                return getCentroid(u, v, treeSize);
        return v;
    }

    static int decompose(int v, int depth) {
        getSubtreeSize(v, -1);
        int centroid = getCentroid(v, -1, subtreeSize[v]);
        removed[centroid] = true;

        int maxDepth = depth;
        for (int u : adj[centroid])
            if (!removed[u]) {
                int result = decompose(u, depth + 1);
                if (result > maxDepth) maxDepth = result;
            }

        removed[centroid] = false;
        return maxDepth;
    }

    public static int centroidDecomposition(int[] arr) {
        int idx = 0;
        int n = arr[idx++];
        if (n <= 1) return 0;

        adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        int m = (arr.length - 1) / 2;
        for (int i = 0; i < m; i++) {
            int u = arr[idx++], v = arr[idx++];
            adj[u].add(v); adj[v].add(u);
        }

        removed = new boolean[n];
        subtreeSize = new int[n];
        return decompose(0, 0);
    }

    public static void main(String[] args) {
        System.out.println(centroidDecomposition(new int[]{4, 0, 1, 1, 2, 2, 3}));
        System.out.println(centroidDecomposition(new int[]{5, 0, 1, 0, 2, 0, 3, 0, 4}));
        System.out.println(centroidDecomposition(new int[]{1}));
        System.out.println(centroidDecomposition(new int[]{7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6}));
    }
}
