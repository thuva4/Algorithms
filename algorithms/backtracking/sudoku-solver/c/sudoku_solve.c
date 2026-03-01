#include <string.h>

static int is_valid(int grid[], int pos, int num) {
    int row = pos / 9;
    int col = pos % 9;

    /* Check row */
    for (int c = 0; c < 9; c++) {
        if (grid[row * 9 + c] == num) return 0;
    }

    /* Check column */
    for (int r = 0; r < 9; r++) {
        if (grid[r * 9 + col] == num) return 0;
    }

    /* Check 3x3 box */
    int box_row = 3 * (row / 3);
    int box_col = 3 * (col / 3);
    for (int r = box_row; r < box_row + 3; r++) {
        for (int c = box_col; c < box_col + 3; c++) {
            if (grid[r * 9 + c] == num) return 0;
        }
    }

    return 1;
}

static int solve(int grid[]) {
    for (int i = 0; i < 81; i++) {
        if (grid[i] == 0) {
            for (int num = 1; num <= 9; num++) {
                if (is_valid(grid, i, num)) {
                    grid[i] = num;
                    if (solve(grid)) return 1;
                    grid[i] = 0;
                }
            }
            return 0;
        }
    }
    return 1;
}

/**
 * Solve a Sudoku puzzle in-place.
 * board: array of 81 integers (0 = empty cell).
 * result: array of 81 integers to store the solution.
 * Returns 1 if a solution is found, 0 otherwise.
 */
int sudoku_solve(int board[], int result[], int n) {
    (void)n; /* n is always 81 */
    memcpy(result, board, 81 * sizeof(int));
    return solve(result);
}
