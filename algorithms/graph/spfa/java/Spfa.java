import java.util.*;

public class Spfa {

    public static int spfa(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        int src = arr[2];
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = arr[3 + 3 * i];
            int v = arr[3 + 3 * i + 1];
            int w = arr[3 + 3 * i + 2];
            adj.get(u).add(new int[]{v, w});
        }

        int INF = Integer.MAX_VALUE / 2;
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        boolean[] inQueue = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.add(src);
        inQueue[src] = true;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            inQueue[u] = false;
            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    if (!inQueue[v]) {
                        queue.add(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        return dist[n - 1] == INF ? -1 : dist[n - 1];
    }
}
