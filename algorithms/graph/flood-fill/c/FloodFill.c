#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SIZE 100

int grid[MAX_SIZE][MAX_SIZE];
int rows, cols;

/**
 * Flood fill algorithm using DFS.
 * Fills all connected cells with the same value as (sr, sc) with newValue.
 */
void floodFill(int sr, int sc, int newValue) {
    int originalValue = grid[sr][sc];
    if (originalValue == newValue) return;

    grid[sr][sc] = newValue;

    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};

    for (int i = 0; i < 4; i++) {
        int nr = sr + dr[i];
        int nc = sc + dc[i];
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == originalValue) {
            floodFill(nr, nc, newValue);
        }
    }
}

char *flood_fill(int arr[], int size, int sr, int sc, int newValue) {
    static char output[100000];
    int best_rows = 1;
    for (int i = 1; i * i <= size; i++) {
        if (size % i == 0) {
            best_rows = i;
        }
    }
    rows = best_rows;
    cols = size / best_rows;
    if (rows <= 0 || cols <= 0 || rows > MAX_SIZE || cols > MAX_SIZE) {
        output[0] = '\0';
        return output;
    }

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            grid[i][j] = arr[i * cols + j];
        }
    }

    floodFill(sr, sc, newValue);

    int offset = 0;
    output[0] = '\0';
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s%d",
                (i == 0 && j == 0) ? "" : " ", grid[i][j]);
        }
    }
    return output;
}

int main() {
    rows = 3;
    cols = 3;
    int input[3][3] = {{1, 1, 1}, {1, 1, 0}, {1, 0, 1}};

    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            grid[i][j] = input[i][j];

    floodFill(0, 0, 2);

    printf("After flood fill:\n");
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%d ", grid[i][j]);
        }
        printf("\n");
    }

    return 0;
}
