#include <vector>

static bool solve(std::vector<std::vector<int>>& grid, std::vector<std::vector<bool>>& visited, int r, int c, int n) {
    if (r == n - 1 && c == n - 1) return true;
    if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] == 0 || visited[r][c]) return false;
    visited[r][c] = true;
    if (solve(grid, visited, r + 1, c, n) || solve(grid, visited, r, c + 1, n)) return true;
    visited[r][c] = false;
    return false;
}

int rat_in_maze(std::vector<int> arr) {
    int n = arr[0];
    std::vector<std::vector<int>> grid(n, std::vector<int>(n));
    int idx = 1;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            grid[i][j] = arr[idx++];

    if (grid[0][0] == 0 || grid[n-1][n-1] == 0) return 0;
    std::vector<std::vector<bool>> visited(n, std::vector<bool>(n, false));
    return solve(grid, visited, 0, 0, n) ? 1 : 0;
}
