using System;

public class MinimumSpanningTreeBoruvka
{
    static int[] par, rnk;

    static int Find(int x)
    {
        while (par[x] != x) { par[x] = par[par[x]]; x = par[x]; }
        return x;
    }

    static bool Unite(int x, int y)
    {
        int rx = Find(x), ry = Find(y);
        if (rx == ry) return false;
        if (rnk[rx] < rnk[ry]) { int t = rx; rx = ry; ry = t; }
        par[ry] = rx;
        if (rnk[rx] == rnk[ry]) rnk[rx]++;
        return true;
    }

    /// <summary>
    /// Find the minimum spanning tree using Boruvka's algorithm.
    /// Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
    /// </summary>
    /// <param name="arr">Input array</param>
    /// <returns>Total weight of the MST</returns>
    public static int Solve(int[] arr)
    {
        int idx = 0;
        int n = arr[idx++];
        int m = arr[idx++];
        int[] eu = new int[m], ev = new int[m], ew = new int[m];
        for (int i = 0; i < m; i++)
        {
            eu[i] = arr[idx++];
            ev[i] = arr[idx++];
            ew[i] = arr[idx++];
        }

        par = new int[n];
        rnk = new int[n];
        for (int i = 0; i < n; i++) par[i] = i;

        int totalWeight = 0;
        int numComponents = n;

        while (numComponents > 1)
        {
            int[] cheapest = new int[n];
            for (int i = 0; i < n; i++) cheapest[i] = -1;

            for (int i = 0; i < m; i++)
            {
                int ru = Find(eu[i]), rv = Find(ev[i]);
                if (ru == rv) continue;
                if (cheapest[ru] == -1 || ew[i] < ew[cheapest[ru]]) cheapest[ru] = i;
                if (cheapest[rv] == -1 || ew[i] < ew[cheapest[rv]]) cheapest[rv] = i;
            }

            for (int node = 0; node < n; node++)
            {
                if (cheapest[node] != -1)
                {
                    if (Unite(eu[cheapest[node]], ev[cheapest[node]]))
                    {
                        totalWeight += ew[cheapest[node]];
                        numComponents--;
                    }
                }
            }
        }

        return totalWeight;
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3 }));
        Console.WriteLine(Solve(new int[] { 4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4 }));
        Console.WriteLine(Solve(new int[] { 2, 1, 0, 1, 7 }));
        Console.WriteLine(Solve(new int[] { 4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3 }));
    }
}
