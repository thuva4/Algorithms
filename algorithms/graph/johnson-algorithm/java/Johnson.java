import java.util.*;

/**
 * Johnson's algorithm for all-pairs shortest paths.
 * Combines Bellman-Ford with Dijkstra's algorithm.
 */
public class Johnson {
    static final double INF = Double.POSITIVE_INFINITY;

    public static Object johnson(int numVertices, int[][] edges) {
        // Add virtual node
        List<int[]> allEdges = new ArrayList<>(Arrays.asList(edges));
        for (int i = 0; i < numVertices; i++) {
            allEdges.add(new int[]{numVertices, i, 0});
        }

        // Bellman-Ford from virtual node
        double[] h = new double[numVertices + 1];
        Arrays.fill(h, INF);
        h[numVertices] = 0;

        for (int i = 0; i < numVertices; i++) {
            for (int[] e : allEdges) {
                if (h[e[0]] != INF && h[e[0]] + e[2] < h[e[1]]) {
                    h[e[1]] = h[e[0]] + e[2];
                }
            }
        }

        // Check for negative cycles
        for (int[] e : allEdges) {
            if (h[e[0]] != INF && h[e[0]] + e[2] < h[e[1]]) {
                return "negative_cycle";
            }
        }

        // Reweight edges and build adjacency list
        Map<Integer, List<int[]>> adjList = new HashMap<>();
        for (int i = 0; i < numVertices; i++) adjList.put(i, new ArrayList<>());
        for (int[] e : edges) {
            int newWeight = (int)(e[2] + h[e[0]] - h[e[1]]);
            adjList.get(e[0]).add(new int[]{e[1], newWeight});
        }

        // Run Dijkstra from each vertex
        Map<Integer, Map<Integer, Double>> result = new LinkedHashMap<>();
        for (int u = 0; u < numVertices; u++) {
            double[] dist = dijkstra(numVertices, adjList, u);
            Map<Integer, Double> distances = new LinkedHashMap<>();
            for (int v = 0; v < numVertices; v++) {
                if (dist[v] == INF) {
                    distances.put(v, INF);
                } else {
                    distances.put(v, dist[v] - h[u] + h[v]);
                }
            }
            result.put(u, distances);
        }

        return result;
    }

    private static double[] dijkstra(int n, Map<Integer, List<int[]>> adjList, int src) {
        double[] dist = new double[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;

        for (int count = 0; count < n; count++) {
            int u = -1;
            double minDist = INF;
            for (int i = 0; i < n; i++) {
                if (!visited[i] && dist[i] < minDist) {
                    minDist = dist[i];
                    u = i;
                }
            }
            if (u == -1) break;
            visited[u] = true;

            for (int[] edge : adjList.getOrDefault(u, Collections.emptyList())) {
                int v = edge[0], w = edge[1];
                if (!visited[v] && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,1,1}, {1,2,2}, {2,3,3}, {0,3,10}};
        Object result = johnson(4, edges);

        if (result instanceof String) {
            System.out.println("Negative cycle detected");
        } else {
            System.out.println("All-pairs shortest distances:");
            for (var entry : ((Map<Integer, Map<Integer, Double>>) result).entrySet()) {
                System.out.println("From " + entry.getKey() + ": " + entry.getValue());
            }
        }
    }
}
