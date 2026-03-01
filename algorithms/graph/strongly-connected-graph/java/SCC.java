import java.util.*;

/**
 * Kosaraju's algorithm to find strongly connected components.
 */
public class SCC {
    public static List<List<Integer>> findSCCs(Map<Integer, List<Integer>> adjList) {
        int numNodes = adjList.size();
        Set<Integer> visited = new HashSet<>();
        List<Integer> finishOrder = new ArrayList<>();

        // First DFS pass
        for (int i = 0; i < numNodes; i++) {
            if (!visited.contains(i)) {
                dfs1(adjList, i, visited, finishOrder);
            }
        }

        // Build reverse graph
        Map<Integer, List<Integer>> revAdj = new HashMap<>();
        for (int node : adjList.keySet()) {
            revAdj.putIfAbsent(node, new ArrayList<>());
        }
        for (Map.Entry<Integer, List<Integer>> entry : adjList.entrySet()) {
            for (int neighbor : entry.getValue()) {
                revAdj.computeIfAbsent(neighbor, k -> new ArrayList<>()).add(entry.getKey());
            }
        }

        // Second DFS pass on reversed graph
        visited.clear();
        List<List<Integer>> components = new ArrayList<>();

        for (int i = finishOrder.size() - 1; i >= 0; i--) {
            int node = finishOrder.get(i);
            if (!visited.contains(node)) {
                List<Integer> component = new ArrayList<>();
                dfs2(revAdj, node, visited, component);
                Collections.sort(component);
                components.add(component);
            }
        }

        components.sort(Comparator.comparingInt(component -> component.get(0)));
        return components;
    }

    private static void dfs1(Map<Integer, List<Integer>> adjList, int node,
            Set<Integer> visited, List<Integer> finishOrder) {
        visited.add(node);
        for (int neighbor : adjList.getOrDefault(node, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                dfs1(adjList, neighbor, visited, finishOrder);
            }
        }
        finishOrder.add(node);
    }

    private static void dfs2(Map<Integer, List<Integer>> revAdj, int node,
            Set<Integer> visited, List<Integer> component) {
        visited.add(node);
        component.add(node);
        for (int neighbor : revAdj.getOrDefault(node, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                dfs2(revAdj, neighbor, visited, component);
            }
        }
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> adjList = new HashMap<>();
        adjList.put(0, List.of(1));
        adjList.put(1, List.of(2));
        adjList.put(2, List.of(0, 3));
        adjList.put(3, List.of(4));
        adjList.put(4, List.of(3));

        List<List<Integer>> components = findSCCs(adjList);
        System.out.println("SCCs: " + components);
    }
}
