import java.util.*;

/**
 * A* search algorithm to find shortest path from start to goal.
 * Uses a weighted adjacency list and heuristic function.
 */
public class AStar {
    public static Map<String, Object> aStar(
            Map<Integer, List<int[]>> adjList,
            int start, int goal,
            Map<Integer, Integer> heuristic) {

        Map<String, Object> result = new HashMap<>();

        if (start == goal) {
            result.put("path", Collections.singletonList(start));
            result.put("cost", 0);
            return result;
        }

        Map<Integer, Double> gScore = new HashMap<>();
        Map<Integer, Integer> cameFrom = new HashMap<>();
        Set<Integer> closedSet = new HashSet<>();

        for (int node : adjList.keySet()) {
            gScore.put(node, Double.POSITIVE_INFINITY);
        }
        gScore.put(start, 0.0);

        // Priority queue: [fScore, node]
        PriorityQueue<double[]> openSet = new PriorityQueue<>(Comparator.comparingDouble(a -> a[0]));
        openSet.offer(new double[]{heuristic.getOrDefault(start, 0), start});

        while (!openSet.isEmpty()) {
            double[] current = openSet.poll();
            int currentNode = (int) current[1];

            if (currentNode == goal) {
                // Reconstruct path
                List<Integer> path = new ArrayList<>();
                int node = goal;
                while (cameFrom.containsKey(node)) {
                    path.add(0, node);
                    node = cameFrom.get(node);
                }
                path.add(0, node);
                result.put("path", path);
                result.put("cost", gScore.get(goal).intValue());
                return result;
            }

            if (closedSet.contains(currentNode)) continue;
            closedSet.add(currentNode);

            for (int[] edge : adjList.getOrDefault(currentNode, Collections.emptyList())) {
                int neighbor = edge[0];
                int weight = edge[1];

                if (closedSet.contains(neighbor)) continue;

                double tentativeG = gScore.get(currentNode) + weight;
                if (tentativeG < gScore.getOrDefault(neighbor, Double.POSITIVE_INFINITY)) {
                    cameFrom.put(neighbor, currentNode);
                    gScore.put(neighbor, tentativeG);
                    double fScore = tentativeG + heuristic.getOrDefault(neighbor, 0);
                    openSet.offer(new double[]{fScore, neighbor});
                }
            }
        }

        result.put("path", Collections.emptyList());
        result.put("cost", Double.POSITIVE_INFINITY);
        return result;
    }

    public static void main(String[] args) {
        Map<Integer, List<int[]>> adjList = new HashMap<>();
        adjList.put(0, Arrays.asList(new int[]{1, 1}, new int[]{2, 4}));
        adjList.put(1, Arrays.asList(new int[]{2, 2}, new int[]{3, 6}));
        adjList.put(2, Collections.singletonList(new int[]{3, 3}));
        adjList.put(3, Collections.emptyList());

        Map<Integer, Integer> heuristic = Map.of(0, 5, 1, 4, 2, 2, 3, 0);

        Map<String, Object> result = aStar(adjList, 0, 3, heuristic);
        System.out.println("Path: " + result.get("path") + ", Cost: " + result.get("cost"));
    }
}
