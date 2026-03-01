#include <vector>

static bool isValid(std::vector<int>& grid, int pos, int num) {
    int row = pos / 9;
    int col = pos % 9;

    // Check row
    for (int c = 0; c < 9; c++) {
        if (grid[row * 9 + c] == num) return false;
    }

    // Check column
    for (int r = 0; r < 9; r++) {
        if (grid[r * 9 + col] == num) return false;
    }

    // Check 3x3 box
    int boxRow = 3 * (row / 3);
    int boxCol = 3 * (col / 3);
    for (int r = boxRow; r < boxRow + 3; r++) {
        for (int c = boxCol; c < boxCol + 3; c++) {
            if (grid[r * 9 + c] == num) return false;
        }
    }

    return true;
}

static bool solve(std::vector<int>& grid) {
    for (int i = 0; i < 81; i++) {
        if (grid[i] == 0) {
            for (int num = 1; num <= 9; num++) {
                if (isValid(grid, i, num)) {
                    grid[i] = num;
                    if (solve(grid)) return true;
                    grid[i] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

std::vector<int> sudokuSolve(std::vector<int> board) {
    std::vector<int> grid = board;
    if (solve(grid)) {
        return grid;
    }
    return std::vector<int>();
}
