package algorithms.graph.connectedcomponentlabeling;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class ConnectedComponents {
    public int[] solve(int[] arr) {
        if (arr == null || arr.length < 2) return new int[0];

        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 2 * m) return new int[0];
        if (n == 0) return new int[0];

        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                adj[u].add(v);
                adj[v].add(u);
            }
        }

        int[] labels = new int[n];
        Arrays.fill(labels, -1);

        Queue<Integer> q = new LinkedList<>();

        for (int i = 0; i < n; i++) {
            if (labels[i] == -1) {
                int componentId = i;
                labels[i] = componentId;
                q.add(i);

                while (!q.isEmpty()) {
                    int u = q.poll();

                    for (int v : adj[u]) {
                        if (labels[v] == -1) {
                            labels[v] = componentId;
                            q.add(v);
                        }
                    }
                }
            }
        }

        return labels;
    }
}
