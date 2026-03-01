using System;
using System.Collections.Generic;

public class StronglyConnectedPathBased
{
    private static List<int>[] adj;
    private static int[] preorder;
    private static int counter, sccCount;
    private static Stack<int> sStack, pStack;
    private static bool[] assigned;

    public static int Solve(int[] arr)
    {
        int n = arr[0], m = arr[1];
        adj = new List<int>[n];
        for (int i = 0; i < n; i++) adj[i] = new List<int>();
        for (int i = 0; i < m; i++) adj[arr[2 + 2 * i]].Add(arr[2 + 2 * i + 1]);

        preorder = new int[n];
        for (int i = 0; i < n; i++) preorder[i] = -1;
        counter = 0; sccCount = 0;
        sStack = new Stack<int>(); pStack = new Stack<int>();
        assigned = new bool[n];

        for (int v = 0; v < n; v++)
        {
            if (preorder[v] == -1) Dfs(v);
        }
        return sccCount;
    }

    private static void Dfs(int v)
    {
        preorder[v] = counter++;
        sStack.Push(v); pStack.Push(v);
        foreach (int w in adj[v])
        {
            if (preorder[w] == -1) Dfs(w);
            else if (!assigned[w])
            {
                while (pStack.Count > 0 && preorder[pStack.Peek()] > preorder[w]) pStack.Pop();
            }
        }
        if (pStack.Count > 0 && pStack.Peek() == v)
        {
            pStack.Pop(); sccCount++;
            while (true)
            {
                int u = sStack.Pop(); assigned[u] = true;
                if (u == v) break;
            }
        }
    }
}
