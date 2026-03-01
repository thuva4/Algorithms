import java.util.*;

public class ChromaticNumber {

    private static List<List<Integer>> adj;
    private static int n;
    private static int[] colors;

    public static int chromaticNumber(int[] arr) {
        n = arr[0];
        int m = arr[1];
        if (n == 0) return 0;
        if (m == 0) return 1;

        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        for (int k = 1; k <= n; k++) {
            colors = new int[n];
            if (solve(0, k)) return k;
        }
        return n;
    }

    private static boolean isSafe(int v, int c) {
        for (int u : adj.get(v)) {
            if (colors[u] == c) return false;
        }
        return true;
    }

    private static boolean solve(int v, int k) {
        if (v == n) return true;
        for (int c = 1; c <= k; c++) {
            if (isSafe(v, c)) {
                colors[v] = c;
                if (solve(v + 1, k)) return true;
                colors[v] = 0;
            }
        }
        return false;
    }
}
