import java.util.*;

public class NetworkFlowMincost {

    static int[] head, to, cap, cost, nxt;
    static int edgeCnt;

    private static void addEdge(int u, int v, int c, int w) {
        to[edgeCnt] = v; cap[edgeCnt] = c; cost[edgeCnt] = w;
        nxt[edgeCnt] = head[u]; head[u] = edgeCnt++;
        to[edgeCnt] = u; cap[edgeCnt] = 0; cost[edgeCnt] = -w;
        nxt[edgeCnt] = head[v]; head[v] = edgeCnt++;
    }

    public static int networkFlowMincost(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        int src = arr[2];
        int sink = arr[3];
        int maxEdges = (m + 10) * 2;

        head = new int[n];
        to = new int[maxEdges];
        cap = new int[maxEdges];
        cost = new int[maxEdges];
        nxt = new int[maxEdges];
        edgeCnt = 0;
        Arrays.fill(head, -1);

        for (int i = 0; i < m; i++) {
            int u = arr[4 + 4 * i];
            int v = arr[4 + 4 * i + 1];
            int c = arr[4 + 4 * i + 2];
            int w = arr[4 + 4 * i + 3];
            addEdge(u, v, c, w);
        }

        int INF = Integer.MAX_VALUE / 2;
        int totalCost = 0;

        while (true) {
            int[] dist = new int[n];
            Arrays.fill(dist, INF);
            dist[src] = 0;
            boolean[] inQueue = new boolean[n];
            int[] prevEdge = new int[n];
            int[] prevNode = new int[n];
            Arrays.fill(prevEdge, -1);
            Queue<Integer> q = new LinkedList<>();
            q.add(src);
            inQueue[src] = true;

            while (!q.isEmpty()) {
                int u = q.poll();
                inQueue[u] = false;
                for (int e = head[u]; e != -1; e = nxt[e]) {
                    int v = to[e];
                    if (cap[e] > 0 && dist[u] + cost[e] < dist[v]) {
                        dist[v] = dist[u] + cost[e];
                        prevEdge[v] = e;
                        prevNode[v] = u;
                        if (!inQueue[v]) {
                            q.add(v);
                            inQueue[v] = true;
                        }
                    }
                }
            }

            if (dist[sink] == INF) break;

            int bottleneck = INF;
            for (int v = sink; v != src; v = prevNode[v]) {
                bottleneck = Math.min(bottleneck, cap[prevEdge[v]]);
            }

            for (int v = sink; v != src; v = prevNode[v]) {
                int e = prevEdge[v];
                cap[e] -= bottleneck;
                cap[e ^ 1] += bottleneck;
            }

            totalCost += bottleneck * dist[sink];
        }

        return totalCost;
    }
}
