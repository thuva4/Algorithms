import java.util.*;

public class PlanarityTesting {

    public static int planarityTesting(int[] arr) {
        int n = arr[0], m = arr[1];
        Set<Long> edges = new HashSet<>();
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
            if (u != v) {
                int a = Math.min(u, v), b = Math.max(u, v);
                edges.add((long) a * n + b);
            }
        }
        int e = edges.size();
        if (n < 3) return 1;
        return e <= 3 * n - 6 ? 1 : 0;
    }
}
