import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

public class TopologicalSortHarness {
    public static int[] topologicalSort(Map<Integer, List<Integer>> adjacencyList) {
        int n = 0;
        for (Map.Entry<Integer, List<Integer>> entry : adjacencyList.entrySet()) {
            n = Math.max(n, entry.getKey() + 1);
            for (int next : entry.getValue()) {
                n = Math.max(n, next + 1);
            }
        }

        int[] indegree = new int[n];
        for (List<Integer> neighbors : adjacencyList.values()) {
            for (int next : neighbors) {
                indegree[next]++;
            }
        }

        PriorityQueue<Integer> ready = new PriorityQueue<>();
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                ready.add(i);
            }
        }

        List<Integer> order = new ArrayList<>();
        while (!ready.isEmpty()) {
            int node = ready.poll();
            order.add(node);
            for (int next : adjacencyList.getOrDefault(node, java.util.Collections.emptyList())) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    ready.add(next);
                }
            }
        }

        int[] result = new int[order.size()];
        for (int i = 0; i < order.size(); i++) {
            result[i] = order.get(i);
        }
        return result;
    }
}
