import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class TopologicalSortKahn {

    public static int[] topologicalSortKahn(int[] arr) {
        if (arr.length < 2) {
            return new int[0];
        }

        int numVertices = arr[0];
        int numEdges = arr[1];

        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numVertices; i++) {
            adj.add(new ArrayList<>());
        }

        int[] inDegree = new int[numVertices];

        for (int i = 0; i < numEdges; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj.get(u).add(v);
            inDegree[v]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int v = 0; v < numVertices; v++) {
            if (inDegree[v] == 0) {
                queue.add(v);
            }
        }

        List<Integer> result = new ArrayList<>();
        while (!queue.isEmpty()) {
            int u = queue.poll();
            result.add(u);
            for (int v : adj.get(u)) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    queue.add(v);
                }
            }
        }

        if (result.size() == numVertices) {
            return result.stream().mapToInt(Integer::intValue).toArray();
        }
        return new int[0];
    }
}
