package algorithms.graph.dijkstras;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

public class Dijkstra {
    private static final int INF = 1000000000;

    private static class Edge {
        int to;
        int weight;

        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    private static class Node implements Comparable<Node> {
        int u;
        int d;

        Node(int u, int d) {
            this.u = u;
            this.d = d;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.d, other.d);
        }
    }

    public int[] solve(int[] arr) {
        if (arr == null || arr.length < 2) return new int[0];

        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 3 * m + 1) return new int[0];

        int start = arr[2 + 3 * m];
        if (start < 0 || start >= n) return new int[0];

        List<Edge>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = arr[2 + 3 * i];
            int v = arr[2 + 3 * i + 1];
            int w = arr[2 + 3 * i + 2];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                adj[u].add(new Edge(v, w));
            }
        }

        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[start] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(new Node(start, 0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.u;
            int d = current.d;

            if (d > dist[u]) continue;

            for (Edge e : adj[u]) {
                if (dist[u] + e.weight < dist[e.to]) {
                    dist[e.to] = dist[u] + e.weight;
                    pq.add(new Node(e.to, dist[e.to]));
                }
            }
        }

        return dist;
    }
}
