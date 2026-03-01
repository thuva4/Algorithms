#include <stdio.h>
#include <stdlib.h>

int min(int a, int b) { return (a < b) ? a : b; }
int max(int a, int b) { return (a > b) ? a : b; }

int dungeon_game(int **grid, int m, int n) {
    int **dp = (int **)malloc(m * sizeof(int *));
    for (int i = 0; i < m; i++)
        dp[i] = (int *)malloc(n * sizeof(int));

    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            if (i == m - 1 && j == n - 1) {
                dp[i][j] = min(0, grid[i][j]);
            } else if (i == m - 1) {
                dp[i][j] = min(0, grid[i][j] + dp[i][j + 1]);
            } else if (j == n - 1) {
                dp[i][j] = min(0, grid[i][j] + dp[i + 1][j]);
            } else {
                dp[i][j] = min(0, grid[i][j] + max(dp[i][j + 1], dp[i + 1][j]));
            }
        }
    }

    int result = abs(dp[0][0]) + 1;

    for (int i = 0; i < m; i++)
        free(dp[i]);
    free(dp);

    return result;
}

int main() {
    int rows = 3, cols = 3;
    int data[3][3] = {{-2, -3, 3}, {-5, -10, 1}, {10, 30, -5}};

    int **grid = (int **)malloc(rows * sizeof(int *));
    for (int i = 0; i < rows; i++) {
        grid[i] = (int *)malloc(cols * sizeof(int));
        for (int j = 0; j < cols; j++)
            grid[i][j] = data[i][j];
    }

    printf("%d\n", dungeon_game(grid, rows, cols)); // 7

    for (int i = 0; i < rows; i++)
        free(grid[i]);
    free(grid);

    return 0;
}

int dungeonGame(int arr[], int size) {
    if (size <= 0) {
        return 1;
    }

    int rows = 1;
    int cols = size;
    for (int candidate = 1; candidate * candidate <= size; candidate++) {
        if (size % candidate == 0) {
            rows = candidate;
            cols = size / candidate;
        }
    }

    int **grid = (int **)malloc(rows * sizeof(int *));
    if (!grid) {
        return 1;
    }

    for (int i = 0; i < rows; i++) {
        grid[i] = (int *)malloc(cols * sizeof(int));
        if (!grid[i]) {
            for (int j = 0; j < i; j++) {
                free(grid[j]);
            }
            free(grid);
            return 1;
        }
        for (int j = 0; j < cols; j++) {
            grid[i][j] = arr[(i * cols) + j];
        }
    }

    int result = dungeon_game(grid, rows, cols);

    for (int i = 0; i < rows; i++) {
        free(grid[i]);
    }
    free(grid);

    return result;
}
