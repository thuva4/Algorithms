using System;
using System.Collections.Generic;

public class TarjansScc
{
    private static int indexCounter;
    private static int sccCount;
    private static int[] disc;
    private static int[] low;
    private static bool[] onStack;
    private static Stack<int> stack;
    private static List<int>[] adj;

    public static int Solve(int[] arr)
    {
        int n = arr[0];
        int m = arr[1];
        adj = new List<int>[n];
        for (int i = 0; i < n; i++)
            adj[i] = new List<int>();
        for (int i = 0; i < m; i++)
        {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj[u].Add(v);
        }

        indexCounter = 0;
        sccCount = 0;
        disc = new int[n];
        low = new int[n];
        onStack = new bool[n];
        stack = new Stack<int>();
        for (int i = 0; i < n; i++) disc[i] = -1;

        for (int v = 0; v < n; v++)
        {
            if (disc[v] == -1)
                Strongconnect(v);
        }

        return sccCount;
    }

    private static void Strongconnect(int v)
    {
        disc[v] = indexCounter;
        low[v] = indexCounter;
        indexCounter++;
        stack.Push(v);
        onStack[v] = true;

        foreach (int w in adj[v])
        {
            if (disc[w] == -1)
            {
                Strongconnect(w);
                low[v] = Math.Min(low[v], low[w]);
            }
            else if (onStack[w])
            {
                low[v] = Math.Min(low[v], disc[w]);
            }
        }

        if (low[v] == disc[v])
        {
            sccCount++;
            while (true)
            {
                int w = stack.Pop();
                onStack[w] = false;
                if (w == v) break;
            }
        }
    }
}
