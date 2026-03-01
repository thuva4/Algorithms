#include "rat_in_a_maze.h"
#include <stdbool.h>

static int grid_g[100][100];
static bool visited_g[100][100];
static int n_g;

static bool solve(int r, int c) {
    if (r == n_g - 1 && c == n_g - 1) return true;
    if (r < 0 || r >= n_g || c < 0 || c >= n_g || grid_g[r][c] == 0 || visited_g[r][c]) return false;
    visited_g[r][c] = true;
    if (solve(r + 1, c) || solve(r, c + 1)) return true;
    visited_g[r][c] = false;
    return false;
}

int rat_in_maze(const int* arr, int size) {
    n_g = arr[0];
    int idx = 1;
    for (int i = 0; i < n_g; i++)
        for (int j = 0; j < n_g; j++) {
            grid_g[i][j] = arr[idx++];
            visited_g[i][j] = false;
        }
    if (grid_g[0][0] == 0 || grid_g[n_g-1][n_g-1] == 0) return 0;
    return solve(0, 0) ? 1 : 0;
}
