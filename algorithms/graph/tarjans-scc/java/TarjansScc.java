import java.util.*;

public class TarjansScc {

    private static int indexCounter;
    private static int sccCount;
    private static int[] disc;
    private static int[] low;
    private static boolean[] onStack;
    private static Deque<Integer> stack;
    private static List<List<Integer>> adj;

    public static int tarjansScc(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = arr[2 + 2 * i];
            int v = arr[2 + 2 * i + 1];
            adj.get(u).add(v);
        }

        indexCounter = 0;
        sccCount = 0;
        disc = new int[n];
        low = new int[n];
        onStack = new boolean[n];
        stack = new ArrayDeque<>();
        Arrays.fill(disc, -1);

        for (int v = 0; v < n; v++) {
            if (disc[v] == -1) {
                strongconnect(v);
            }
        }

        return sccCount;
    }

    private static void strongconnect(int v) {
        disc[v] = indexCounter;
        low[v] = indexCounter;
        indexCounter++;
        stack.push(v);
        onStack[v] = true;

        for (int w : adj.get(v)) {
            if (disc[w] == -1) {
                strongconnect(w);
                low[v] = Math.min(low[v], low[w]);
            } else if (onStack[w]) {
                low[v] = Math.min(low[v], disc[w]);
            }
        }

        if (low[v] == disc[v]) {
            sccCount++;
            while (true) {
                int w = stack.pop();
                onStack[w] = false;
                if (w == v) break;
            }
        }
    }
}
