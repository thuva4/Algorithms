package algorithms.graph.bidirectionalbfs;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class BidirectionalBfs {
    public int solve(int[] arr) {
        if (arr == null || arr.length < 4) return -1;

        int n = arr[0];
        int m = arr[1];
        int start = arr[2];
        int end = arr[3];

        if (arr.length < 4 + 2 * m) return -1;
        if (start == end) return 0;

        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = arr[4 + 2 * i];
            int v = arr[4 + 2 * i + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                adj[u].add(v);
                adj[v].add(u);
            }
        }

        int[] distStart = new int[n];
        int[] distEnd = new int[n];
        Arrays.fill(distStart, -1);
        Arrays.fill(distEnd, -1);

        Queue<Integer> qStart = new LinkedList<>();
        Queue<Integer> qEnd = new LinkedList<>();

        qStart.add(start);
        distStart[start] = 0;

        qEnd.add(end);
        distEnd[end] = 0;

        while (!qStart.isEmpty() && !qEnd.isEmpty()) {
            // Start
            int u = qStart.poll();
            if (distEnd[u] != -1) return distStart[u] + distEnd[u];

            for (int v : adj[u]) {
                if (distStart[v] == -1) {
                    distStart[v] = distStart[u] + 1;
                    if (distEnd[v] != -1) return distStart[v] + distEnd[v];
                    qStart.add(v);
                }
            }

            // End
            u = qEnd.poll();
            if (distStart[u] != -1) return distStart[u] + distEnd[u];

            for (int v : adj[u]) {
                if (distEnd[v] == -1) {
                    distEnd[v] = distEnd[u] + 1;
                    if (distStart[v] != -1) return distStart[v] + distEnd[v];
                    qEnd.add(v);
                }
            }
        }

        return -1;
    }
}
