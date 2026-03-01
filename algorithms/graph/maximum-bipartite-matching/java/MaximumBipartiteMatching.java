import java.util.*;

public class MaximumBipartiteMatching {

    private static List<List<Integer>> adj;
    private static int[] matchRight;

    public static int maximumBipartiteMatching(int[] arr) {
        int nLeft = arr[0], nRight = arr[1], m = arr[2];
        adj = new ArrayList<>();
        for (int i = 0; i < nLeft; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            adj.get(arr[3 + 2 * i]).add(arr[3 + 2 * i + 1]);
        }
        matchRight = new int[nRight];
        Arrays.fill(matchRight, -1);
        int result = 0;
        for (int u = 0; u < nLeft; u++) {
            boolean[] visited = new boolean[nRight];
            if (dfs(u, visited)) result++;
        }
        return result;
    }

    private static boolean dfs(int u, boolean[] visited) {
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true;
                if (matchRight[v] == -1 || dfs(matchRight[v], visited)) {
                    matchRight[v] = u;
                    return true;
                }
            }
        }
        return false;
    }
}
