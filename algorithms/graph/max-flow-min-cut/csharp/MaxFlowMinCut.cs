using System;
using System.Collections.Generic;

public class MaxFlowMinCut
{
    public static int Run(int[] arr)
    {
        int n = arr[0], m = arr[1], src = arr[2], sink = arr[3];
        int[,] cap = new int[n, n];
        for (int i = 0; i < m; i++) cap[arr[4+3*i], arr[5+3*i]] += arr[6+3*i];
        int maxFlow = 0;
        while (true)
        {
            int[] parent = new int[n];
            for (int i = 0; i < n; i++) parent[i] = -1;
            parent[src] = src;
            Queue<int> queue = new Queue<int>();
            queue.Enqueue(src);
            while (queue.Count > 0 && parent[sink] == -1)
            {
                int u = queue.Dequeue();
                for (int v = 0; v < n; v++)
                    if (parent[v] == -1 && cap[u, v] > 0) { parent[v] = u; queue.Enqueue(v); }
            }
            if (parent[sink] == -1) break;
            int flow = int.MaxValue;
            for (int v = sink; v != src; v = parent[v]) flow = Math.Min(flow, cap[parent[v], v]);
            for (int v = sink; v != src; v = parent[v]) { cap[parent[v], v] -= flow; cap[v, parent[v]] += flow; }
            maxFlow += flow;
        }
        return maxFlow;
    }
}
