import java.util.*;

public class StronglyConnectedPathBased {

    public static int stronglyConnectedPathBased(int[] arr) {
        int n = arr[0], m = arr[1];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            adj.get(arr[2 + 2 * i]).add(arr[2 + 2 * i + 1]);
        }

        int[] preorder = new int[n];
        Arrays.fill(preorder, -1);
        int[] counter = {0};
        Deque<Integer> sStack = new ArrayDeque<>();
        Deque<Integer> pStack = new ArrayDeque<>();
        boolean[] assigned = new boolean[n];
        int[] sccCount = {0};

        for (int v = 0; v < n; v++) {
            if (preorder[v] == -1) dfs(v, adj, preorder, counter, sStack, pStack, assigned, sccCount);
        }

        return sccCount[0];
    }

    private static void dfs(int v, List<List<Integer>> adj, int[] preorder, int[] counter,
                            Deque<Integer> sStack, Deque<Integer> pStack, boolean[] assigned, int[] sccCount) {
        preorder[v] = counter[0]++;
        sStack.push(v);
        pStack.push(v);

        for (int w : adj.get(v)) {
            if (preorder[w] == -1) {
                dfs(w, adj, preorder, counter, sStack, pStack, assigned, sccCount);
            } else if (!assigned[w]) {
                while (preorder[pStack.peek()] > preorder[w]) pStack.pop();
            }
        }

        if (!pStack.isEmpty() && pStack.peek() == v) {
            pStack.pop();
            sccCount[0]++;
            while (true) {
                int u = sStack.pop();
                assigned[u] = true;
                if (u == v) break;
            }
        }
    }
}
