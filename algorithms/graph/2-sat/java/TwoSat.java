package algorithms.graph.twosat;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class TwoSat {
    private List<Integer>[] adj;
    private int[] dfn, low, sccId;
    private boolean[] inStack;
    private Stack<Integer> stack;
    private int timer, sccCnt;

    public int solve(int[] arr) {
        if (arr == null || arr.length < 2) return 0;
        int n = arr[0];
        int m = arr[1];

        if (arr.length < 2 + 2 * m) return 0;

        int numNodes = 2 * n;
        adj = new ArrayList[numNodes];
        for (int i = 0; i < numNodes; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int uRaw = arr[2 + 2 * i];
            int vRaw = arr[2 + 2 * i + 1];

            int u = (Math.abs(uRaw) - 1) * 2 + (uRaw < 0 ? 1 : 0);
            int v = (Math.abs(vRaw) - 1) * 2 + (vRaw < 0 ? 1 : 0);

            int notU = u ^ 1;
            int notV = v ^ 1;

            adj[notU].add(v);
            adj[notV].add(u);
        }

        dfn = new int[numNodes];
        low = new int[numNodes];
        sccId = new int[numNodes];
        inStack = new boolean[numNodes];
        stack = new Stack<>();
        timer = 0;
        sccCnt = 0;

        for (int i = 0; i < numNodes; i++) {
            if (dfn[i] == 0) tarjan(i);
        }

        for (int i = 0; i < n; i++) {
            if (sccId[2 * i] == sccId[2 * i + 1]) return 0;
        }

        return 1;
    }

    private void tarjan(int u) {
        dfn[u] = low[u] = ++timer;
        stack.push(u);
        inStack[u] = true;

        for (int v : adj[u]) {
            if (dfn[v] == 0) {
                tarjan(v);
                low[u] = Math.min(low[u], low[v]);
            } else if (inStack[v]) {
                low[u] = Math.min(low[u], dfn[v]);
            }
        }

        if (low[u] == dfn[u]) {
            sccCnt++;
            int v;
            do {
                v = stack.pop();
                inStack[v] = false;
                sccId[v] = sccCnt;
            } while (u != v);
        }
    }
}
