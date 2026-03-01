package algorithms.graph.dinic;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Dinic {
    private static class Edge {
        int to;
        int rev;
        long cap;
        long flow;

        Edge(int to, int rev, long cap) {
            this.to = to;
            this.rev = rev;
            this.cap = cap;
            this.flow = 0;
        }
    }

    private List<Edge>[] adj;
    private int[] level;
    private int[] ptr;

    public int solve(int[] arr) {
        if (arr == null || arr.length < 4) return 0;
        int n = arr[0];
        int m = arr[1];
        int s = arr[2];
        int t = arr[3];

        if (arr.length < 4 + 3 * m) return 0;

        adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = arr[4 + 3 * i];
            int v = arr[4 + 3 * i + 1];
            long cap = arr[4 + 3 * i + 2];
            if (u >= 0 && u < n && v >= 0 && v < n) {
                addEdge(u, v, cap);
            }
        }

        level = new int[n];
        ptr = new int[n];

        long flow = 0;
        while (bfs(s, t, n)) {
            Arrays.fill(ptr, 0);
            while (true) {
                long pushed = dfs(s, t, Long.MAX_VALUE);
                if (pushed == 0) break;
                flow += pushed;
            }
        }

        return (int) flow;
    }

    private void addEdge(int u, int v, long cap) {
        Edge a = new Edge(v, adj[v].size(), cap);
        Edge b = new Edge(u, adj[u].size(), 0);
        adj[u].add(a);
        adj[v].add(b);
    }

    private boolean bfs(int s, int t, int n) {
        Arrays.fill(level, -1);
        level[s] = 0;
        Queue<Integer> q = new LinkedList<>();
        q.add(s);

        while (!q.isEmpty()) {
            int u = q.poll();
            for (Edge e : adj[u]) {
                if (e.cap - e.flow > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.add(e.to);
                }
            }
        }
        return level[t] != -1;
    }

    private long dfs(int u, int t, long pushed) {
        if (pushed == 0) return 0;
        if (u == t) return pushed;

        for (; ptr[u] < adj[u].size(); ptr[u]++) {
            int id = ptr[u];
            Edge e = adj[u].get(id);
            int v = e.to;

            if (level[u] + 1 != level[v] || e.cap - e.flow == 0) continue;

            long tr = pushed;
            if (e.cap - e.flow < tr) tr = e.cap - e.flow;

            long pushedFlow = dfs(v, t, tr);
            if (pushedFlow == 0) continue;

            e.flow += pushedFlow;
            adj[v].get(e.rev).flow -= pushedFlow;

            return pushedFlow;
        }

        return 0;
    }
}
