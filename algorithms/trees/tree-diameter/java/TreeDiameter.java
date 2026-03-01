import java.util.*;

public class TreeDiameter {

    public static int treeDiameter(int[] arr) {
        int idx = 0;
        int n = arr[idx++];
        if (n <= 1) return 0;

        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        int m = (arr.length - 1) / 2;
        for (int i = 0; i < m; i++) {
            int u = arr[idx++], v = arr[idx++];
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] result = bfs(0, n, adj);
        result = bfs(result[0], n, adj);
        return result[1];
    }

    private static int[] bfs(int start, int n, List<Integer>[] adj) {
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        Queue<Integer> queue = new LinkedList<>();
        queue.add(start);
        int farthest = start;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int nb : adj[node]) {
                if (dist[nb] == -1) {
                    dist[nb] = dist[node] + 1;
                    queue.add(nb);
                    if (dist[nb] > dist[farthest]) farthest = nb;
                }
            }
        }
        return new int[]{farthest, dist[farthest]};
    }

    public static void main(String[] args) {
        System.out.println(treeDiameter(new int[]{4, 0, 1, 1, 2, 2, 3}));
        System.out.println(treeDiameter(new int[]{5, 0, 1, 0, 2, 0, 3, 0, 4}));
        System.out.println(treeDiameter(new int[]{2, 0, 1}));
        System.out.println(treeDiameter(new int[]{1}));
    }
}
