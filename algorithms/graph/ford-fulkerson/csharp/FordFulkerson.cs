using System;

public class FordFulkerson
{
    private static int[,] capF;
    private static int nF;

    private static int DfsF(int u, int sink, int flow, bool[] visited)
    {
        if (u == sink) return flow;
        visited[u] = true;
        for (int v = 0; v < nF; v++)
        {
            if (!visited[v] && capF[u, v] > 0)
            {
                int d = DfsF(v, sink, Math.Min(flow, capF[u, v]), visited);
                if (d > 0) { capF[u, v] -= d; capF[v, u] += d; return d; }
            }
        }
        return 0;
    }

    public static int Run(int[] arr)
    {
        nF = arr[0]; int m = arr[1]; int src = arr[2]; int sink = arr[3];
        capF = new int[nF, nF];
        for (int i = 0; i < m; i++) capF[arr[4+3*i], arr[5+3*i]] += arr[6+3*i];
        int maxFlow = 0;
        while (true)
        {
            bool[] visited = new bool[nF];
            int flow = DfsF(src, sink, int.MaxValue, visited);
            if (flow == 0) break;
            maxFlow += flow;
        }
        return maxFlow;
    }
}
