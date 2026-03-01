public class FloodFillRunner {
    public static int[][] floodFill(int[][] grid, int startRow, int startCol, int newValue) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return new int[0][0];
        }
        int[][] result = new int[grid.length][grid[0].length];
        for (int r = 0; r < grid.length; r++) {
            result[r] = grid[r].clone();
        }

        int original = result[startRow][startCol];
        if (original == newValue) {
            return result;
        }

        fill(result, startRow, startCol, original, newValue);
        return result;
    }

    private static void fill(int[][] grid, int row, int col, int original, int newValue) {
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
            return;
        }
        if (grid[row][col] != original) {
            return;
        }
        grid[row][col] = newValue;
        fill(grid, row + 1, col, original, newValue);
        fill(grid, row - 1, col, original, newValue);
        fill(grid, row, col + 1, original, newValue);
        fill(grid, row, col - 1, original, newValue);
    }
}
