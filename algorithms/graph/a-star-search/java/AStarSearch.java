package algorithms.graph.astarsearch;

import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Arrays;

public class AStarSearch {
    private static class Node implements Comparable<Node> {
        int id;
        int f, g;

        Node(int id, int f, int g) {
            this.id = id;
            this.f = f;
            this.g = g;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.f, other.f);
        }
    }

    private static class Edge {
        int to;
        int weight;

        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    public int solve(int[] arr) {
        if (arr == null || arr.length < 2) return -1;

        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 3 * m + 2 + n) return -1;

        int start = arr[2 + 3 * m];
        int goal = arr[2 + 3 * m + 1];

        if (start < 0 || start >= n || goal < 0 || goal >= n) return -1;
        if (start == goal) return 0;

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

        int hIndex = 2 + 3 * m + 2;

        PriorityQueue<Node> openSet = new PriorityQueue<>();
        int[] gScore = new int[n];
        Arrays.fill(gScore, Integer.MAX_VALUE);

        gScore[start] = 0;
        openSet.add(new Node(start, arr[hIndex + start], 0));

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();
            int u = current.id;

            if (u == goal) return current.g;

            if (current.g > gScore[u]) continue;

            for (Edge e : adj[u]) {
                int v = e.to;
                int w = e.weight;

                if (gScore[u] != Integer.MAX_VALUE && (long) gScore[u] + w < gScore[v]) {
                    gScore[v] = gScore[u] + w;
                    int f = gScore[v] + arr[hIndex + v];
                    openSet.add(new Node(v, f, gScore[v]));
                }
            }
        }

        return -1;
    }
}
