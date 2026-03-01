import java.util.*;

public class ShortestPathDag {

    /**
     * Find shortest path from source to vertex n-1 in a DAG.
     *
     * Input format: [n, m, src, u1, v1, w1, ...]
     * @param arr input array
     * @return shortest distance from src to n-1, or -1 if unreachable
     */
    public static int shortestPathDag(int[] arr) {
        int idx = 0;
        int n = arr[idx++];
        int m = arr[idx++];
        int src = arr[idx++];

        List<int[]>[] adj = new ArrayList[n];
        int[] inDegree = new int[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = arr[idx++], v = arr[idx++], w = arr[idx++];
            adj[u].add(new int[]{v, w});
            inDegree[v]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < n; i++)
            if (inDegree[i] == 0) queue.add(i);

        List<Integer> topoOrder = new ArrayList<>();
        while (!queue.isEmpty()) {
            int node = queue.poll();
            topoOrder.add(node);
            for (int[] edge : adj[node]) {
                if (--inDegree[edge[0]] == 0) queue.add(edge[0]);
            }
        }

        int INF = Integer.MAX_VALUE;
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;

        for (int u : topoOrder) {
            if (dist[u] == INF) continue;
            for (int[] edge : adj[u]) {
                if (dist[u] + edge[1] < dist[edge[0]]) {
                    dist[edge[0]] = dist[u] + edge[1];
                }
            }
        }

        return dist[n - 1] == INF ? -1 : dist[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(shortestPathDag(new int[]{4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7})); // 3
        System.out.println(shortestPathDag(new int[]{3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1}));           // 3
        System.out.println(shortestPathDag(new int[]{2, 1, 0, 0, 1, 10}));                             // 10
        System.out.println(shortestPathDag(new int[]{3, 1, 0, 1, 2, 5}));                              // -1
    }
}
