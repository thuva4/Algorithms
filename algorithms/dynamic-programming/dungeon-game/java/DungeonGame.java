public class DungeonGame {

    public static int dungeonGame(int[][] grid) {
        int m = grid.length;
        if (m == 0) return 0;
        int n = grid[0].length;

        int[][] dp = new int[m][n];

        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                if (i == m - 1 && j == n - 1) {
                    dp[i][j] = Math.min(0, grid[i][j]);
                } else if (i == m - 1) {
                    dp[i][j] = Math.min(0, grid[i][j] + dp[i][j + 1]);
                } else if (j == n - 1) {
                    dp[i][j] = Math.min(0, grid[i][j] + dp[i + 1][j]);
                } else {
                    dp[i][j] = Math.min(0, grid[i][j] + Math.max(dp[i][j + 1], dp[i + 1][j]));
                }
            }
        }

        return Math.abs(dp[0][0]) + 1;
    }

    public static void main(String[] args) {
        int[][] grid = {
            {-2, -3, 3},
            {-5, -10, 1},
            {10, 30, -5}
        };
        System.out.println(dungeonGame(grid)); // 7
    }
}
