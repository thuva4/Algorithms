import java.util.*;

/**
 * Prim's algorithm to find the Minimum Spanning Tree (MST) total weight.
 * Uses a weighted adjacency list.
 */
public class Prim {
    public static int prim(int numVertices, Map<Integer, List<List<Integer>>> adjList) {
        boolean[] inMST = new boolean[numVertices];
        int[] key = new int[numVertices];
        Arrays.fill(key, Integer.MAX_VALUE);
        key[0] = 0;

        // Priority queue: [weight, vertex]
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, 0});

        int totalWeight = 0;

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int w = current[0];
            int u = current[1];

            if (inMST[u]) continue;

            inMST[u] = true;
            totalWeight += w;

            List<List<Integer>> neighbors = adjList.getOrDefault(u, Collections.emptyList());
            for (List<Integer> edge : neighbors) {
                int v = edge.get(0);
                int weight = edge.get(1);
                if (!inMST[v] && weight < key[v]) {
                    key[v] = weight;
                    pq.offer(new int[]{weight, v});
                }
            }
        }

        return totalWeight;
    }

    public static void main(String[] args) {
        Map<Integer, List<List<Integer>>> adjList = new HashMap<>();
        adjList.put(0, Arrays.asList(Arrays.asList(1, 10), Arrays.asList(2, 6), Arrays.asList(3, 5)));
        adjList.put(1, Arrays.asList(Arrays.asList(0, 10), Arrays.asList(3, 15)));
        adjList.put(2, Arrays.asList(Arrays.asList(0, 6), Arrays.asList(3, 4)));
        adjList.put(3, Arrays.asList(Arrays.asList(0, 5), Arrays.asList(1, 15), Arrays.asList(2, 4)));

        int result = prim(4, adjList);
        System.out.println("MST total weight: " + result);
    }
}
