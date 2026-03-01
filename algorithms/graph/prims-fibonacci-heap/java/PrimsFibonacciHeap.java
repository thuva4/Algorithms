import java.util.*;

public class PrimsFibonacciHeap {

    public static int primsFibonacciHeap(int[] arr) {
        int n = arr[0], m = arr[1];
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 3 * i], v = arr[2 + 3 * i + 1], w = arr[2 + 3 * i + 2];
            adj.get(u).add(new int[]{w, v});
            adj.get(v).add(new int[]{w, u});
        }

        boolean[] inMst = new boolean[n];
        int[] key = new int[n];
        Arrays.fill(key, Integer.MAX_VALUE);
        key[0] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.add(new int[]{0, 0});
        int total = 0;

        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int w = top[0], u = top[1];
            if (inMst[u]) continue;
            inMst[u] = true;
            total += w;
            for (int[] edge : adj.get(u)) {
                int ew = edge[0], v = edge[1];
                if (!inMst[v] && ew < key[v]) {
                    key[v] = ew;
                    pq.add(new int[]{ew, v});
                }
            }
        }

        return total;
    }
}
