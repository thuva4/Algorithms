import java.util.*;

public class DpOnTrees {
    public static int dpOnTrees(int n, int[] values, int[][] edges) {
        if (n == 0) return 0;
        if (n == 1) return values[0];

        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }

        int[] dp = new int[n];
        int[] parent = new int[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(parent, -1);

        // BFS to get processing order, then process in reverse
        List<Integer> order = new ArrayList<>();
        Queue<Integer> queue = new LinkedList<>();
        queue.add(0);
        visited[0] = true;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int child : adj.get(node)) {
                if (!visited[child]) {
                    visited[child] = true;
                    parent[child] = node;
                    queue.add(child);
                }
            }
        }

        // Process in reverse BFS order (leaves first)
        for (int i = order.size() - 1; i >= 0; i--) {
            int node = order.get(i);
            int bestChild = 0;
            for (int child : adj.get(node)) {
                if (child != parent[node]) {
                    bestChild = Math.max(bestChild, dp[child]);
                }
            }
            dp[node] = values[node] + bestChild;
        }

        int ans = Integer.MIN_VALUE;
        for (int v : dp) ans = Math.max(ans, v);
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = sc.nextInt();
        int[][] edges = new int[Math.max(0, n - 1)][2];
        for (int i = 0; i < n - 1; i++) {
            edges[i][0] = sc.nextInt();
            edges[i][1] = sc.nextInt();
        }
        System.out.println(dpOnTrees(n, values, edges));
    }
}
