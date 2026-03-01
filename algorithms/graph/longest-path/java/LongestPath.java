import java.util.*;

/**
 * Longest path in a DAG using topological sort.
 */
public class LongestPath {
    public static Map<Integer, Double> longestPath(
            Map<Integer, List<List<Integer>>> adjList, int startNode) {
        int numNodes = adjList.size();
        Set<Integer> visited = new HashSet<>();
        List<Integer> topoOrder = new ArrayList<>();

        // Topological sort via DFS
        for (int i = 0; i < numNodes; i++) {
            if (!visited.contains(i)) {
                dfs(adjList, i, visited, topoOrder);
            }
        }

        // Initialize distances
        double[] dist = new double[numNodes];
        Arrays.fill(dist, Double.NEGATIVE_INFINITY);
        dist[startNode] = 0;

        // Process in topological order
        for (int i = topoOrder.size() - 1; i >= 0; i--) {
            int u = topoOrder.get(i);
            if (dist[u] != Double.NEGATIVE_INFINITY) {
                for (List<Integer> edge : adjList.getOrDefault(u, Collections.emptyList())) {
                    int v = edge.get(0);
                    int w = edge.get(1);
                    if (dist[u] + w > dist[v]) {
                        dist[v] = dist[u] + w;
                    }
                }
            }
        }

        Map<Integer, Double> result = new LinkedHashMap<>();
        for (int i = 0; i < numNodes; i++) {
            result.put(i, dist[i]);
        }
        return result;
    }

    private static void dfs(Map<Integer, List<List<Integer>>> adjList, int node,
            Set<Integer> visited, List<Integer> topoOrder) {
        visited.add(node);
        for (List<Integer> edge : adjList.getOrDefault(node, Collections.emptyList())) {
            int next = edge.get(0);
            if (!visited.contains(next)) {
                dfs(adjList, next, visited, topoOrder);
            }
        }
        topoOrder.add(node);
    }

    public static void main(String[] args) {
        Map<Integer, List<List<Integer>>> adjList = new HashMap<>();
        adjList.put(0, Arrays.asList(Arrays.asList(1, 3), Arrays.asList(2, 6)));
        adjList.put(1, Arrays.asList(Arrays.asList(3, 4), Arrays.asList(2, 4)));
        adjList.put(2, Collections.singletonList(Arrays.asList(3, 2)));
        adjList.put(3, Collections.emptyList());

        Map<Integer, Double> result = longestPath(adjList, 0);
        System.out.println("Longest distances: " + result);
    }
}
