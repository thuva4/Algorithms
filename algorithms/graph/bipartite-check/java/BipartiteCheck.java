package algorithms.graph.bipartitecheck;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class BipartiteCheck {
    public int solve(int[] arr) {
        if (arr == null || arr.length < 2) return 0;

        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 2 * m) return 0;
        if (n == 0) return 1;

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

        int[] color = new int[n]; // 0: none, 1: red, -1: blue
        Queue<Integer> q = new LinkedList<>();

        for (int i = 0; i < n; i++) {
            if (color[i] == 0) {
                color[i] = 1;
                q.add(i);

                while (!q.isEmpty()) {
                    int u = q.poll();

                    for (int v : adj[u]) {
                        if (color[v] == 0) {
                            color[v] = -color[u];
                            q.add(v);
                        } else if (color[v] == color[u]) {
                            return 0;
                        }
                    }
                }
            }
        }

        return 1;
    }
}
