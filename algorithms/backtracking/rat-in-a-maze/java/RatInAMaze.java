public class RatInAMaze {

    public static int ratInMaze(int[] arr) {
        int n = arr[0];
        int[][] grid = new int[n][n];
        int idx = 1;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                grid[i][j] = arr[idx++];

        if (grid[0][0] == 0 || grid[n-1][n-1] == 0) return 0;
        boolean[][] visited = new boolean[n][n];
        return solve(grid, visited, 0, 0, n) ? 1 : 0;
    }

    private static boolean solve(int[][] grid, boolean[][] visited, int r, int c, int n) {
        if (r == n - 1 && c == n - 1) return true;
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] == 0 || visited[r][c]) return false;
        visited[r][c] = true;
        if (solve(grid, visited, r + 1, c, n) || solve(grid, visited, r, c + 1, n)) return true;
        visited[r][c] = false;
        return false;
    }
}
