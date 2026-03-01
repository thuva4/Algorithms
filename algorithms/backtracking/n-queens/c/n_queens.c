#include <stdlib.h>

static int count;
static int *col_used;
static int *diag_used;
static int *anti_diag_used;

static void backtrack(int row, int n) {
    if (row == n) {
        count++;
        return;
    }
    for (int col = 0; col < n; col++) {
        int d = row - col + n - 1;
        int ad = row + col;
        if (col_used[col] || diag_used[d] || anti_diag_used[ad]) {
            continue;
        }
        col_used[col] = 1;
        diag_used[d] = 1;
        anti_diag_used[ad] = 1;
        backtrack(row + 1, n);
        col_used[col] = 0;
        diag_used[d] = 0;
        anti_diag_used[ad] = 0;
    }
}

int n_queens(int n) {
    if (n <= 0) {
        return 0;
    }
    count = 0;
    col_used = (int *)calloc(n, sizeof(int));
    diag_used = (int *)calloc(2 * n - 1, sizeof(int));
    anti_diag_used = (int *)calloc(2 * n - 1, sizeof(int));

    backtrack(0, n);

    free(col_used);
    free(diag_used);
    free(anti_diag_used);

    return count;
}
