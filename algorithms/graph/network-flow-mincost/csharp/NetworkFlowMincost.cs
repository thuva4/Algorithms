using System;
using System.Collections.Generic;

public class NetworkFlowMincost
{
    public static int Solve(int[] arr)
    {
        int n = arr[0], m = arr[1], src = arr[2], sink = arr[3];
        int[] head = new int[n];
        for (int i = 0; i < n; i++) head[i] = -1;
        var to = new List<int>(); var cap = new List<int>();
        var cost = new List<int>(); var nxt = new List<int>();
        int edgeCnt = 0;

        void AddEdge(int u, int v, int c, int w)
        {
            to.Add(v); cap.Add(c); cost.Add(w); nxt.Add(head[u]); head[u] = edgeCnt++;
            to.Add(u); cap.Add(0); cost.Add(-w); nxt.Add(head[v]); head[v] = edgeCnt++;
        }

        for (int i = 0; i < m; i++)
        {
            AddEdge(arr[4 + 4 * i], arr[4 + 4 * i + 1], arr[4 + 4 * i + 2], arr[4 + 4 * i + 3]);
        }

        int INF = int.MaxValue / 2;
        int totalCost = 0;

        while (true)
        {
            int[] dist = new int[n];
            for (int i = 0; i < n; i++) dist[i] = INF;
            dist[src] = 0;
            bool[] inQueue = new bool[n];
            int[] prevEdge = new int[n], prevNode = new int[n];
            for (int i = 0; i < n; i++) prevEdge[i] = -1;
            var q = new Queue<int>();
            q.Enqueue(src); inQueue[src] = true;

            while (q.Count > 0)
            {
                int u = q.Dequeue(); inQueue[u] = false;
                for (int e = head[u]; e != -1; e = nxt[e])
                {
                    int v = to[e];
                    if (cap[e] > 0 && dist[u] + cost[e] < dist[v])
                    {
                        dist[v] = dist[u] + cost[e];
                        prevEdge[v] = e; prevNode[v] = u;
                        if (!inQueue[v]) { q.Enqueue(v); inQueue[v] = true; }
                    }
                }
            }

            if (dist[sink] == INF) break;

            int bottleneck = INF;
            for (int v = sink; v != src; v = prevNode[v])
                bottleneck = Math.Min(bottleneck, cap[prevEdge[v]]);

            for (int v = sink; v != src; v = prevNode[v])
            {
                int e = prevEdge[v];
                cap[e] -= bottleneck; cap[e ^ 1] += bottleneck;
            }

            totalCost += bottleneck * dist[sink];
        }

        return totalCost;
    }
}
