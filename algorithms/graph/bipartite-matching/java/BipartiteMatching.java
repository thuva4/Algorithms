package algorithms.graph.bipartitematching;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class BipartiteMatching {
    private int nLeft, nRight;
    private List<Integer>[] adj;
    private int[] pairU, pairV, dist;

    public int solve(int[] arr) {
        if (arr == null || arr.length < 3) return 0;

        nLeft = arr[0];
        nRight = arr[1];
        int m = arr[2];

        if (arr.length < 3 + 2 * m) return 0;
        if (nLeft == 0 || nRight == 0) return 0;

        adj = new ArrayList[nLeft];
        for (int i = 0; i < nLeft; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = arr[3 + 2 * i];
            int v = arr[3 + 2 * i + 1];
            if (u >= 0 && u < nLeft && v >= 0 && v < nRight) {
                adj[u].add(v);
            }
        }

        pairU = new int[nLeft];
        pairV = new int[nRight];
        dist = new int[nLeft + 1];

        Arrays.fill(pairU, -1);
        Arrays.fill(pairV, -1);

        int matching = 0;
        while (bfs()) {
            for (int u = 0; u < nLeft; u++) {
                if (pairU[u] == -1 && dfs(u)) {
                    matching++;
                }
            }
        }

        return matching;
    }

    private boolean bfs() {
        Queue<Integer> q = new LinkedList<>();
        for (int u = 0; u < nLeft; u++) {
            if (pairU[u] == -1) {
                dist[u] = 0;
                q.add(u);
            } else {
                dist[u] = Integer.MAX_VALUE;
            }
        }

        dist[nLeft] = Integer.MAX_VALUE;

        while (!q.isEmpty()) {
            int u = q.poll();

            if (dist[u] < dist[nLeft]) {
                for (int v : adj[u]) {
                    int pu = pairV[v];
                    if (pu == -1) {
                        if (dist[nLeft] == Integer.MAX_VALUE) {
                            dist[nLeft] = dist[u] + 1;
                        }
                    } else if (dist[pu] == Integer.MAX_VALUE) {
                        dist[pu] = dist[u] + 1;
                        q.add(pu);
                    }
                }
            }
        }

        return dist[nLeft] != Integer.MAX_VALUE;
    }

    private boolean dfs(int u) {
        if (u != -1) {
            for (int v : adj[u]) {
                int pu = pairV[v];
                if (pu == -1 || (dist[pu] == dist[u] + 1 && dfs(pu))) {
                    pairV[v] = u;
                    pairU[u] = v;
                    return true;
                }
            }
            dist[u] = Integer.MAX_VALUE;
            return false;
        }
        return true;
    }
}
