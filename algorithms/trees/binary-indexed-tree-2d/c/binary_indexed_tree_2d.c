#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "binary_indexed_tree_2d.h"

BIT2D* bit2d_create(int rows, int cols) {
    BIT2D* bit = (BIT2D*)malloc(sizeof(BIT2D));
    bit->rows = rows; bit->cols = cols;
    bit->tree = (long long**)malloc((rows + 1) * sizeof(long long*));
    for (int i = 0; i <= rows; i++)
        bit->tree[i] = (long long*)calloc(cols + 1, sizeof(long long));
    return bit;
}

void bit2d_update(BIT2D* bit, int r, int c, long long val) {
    for (int i = r + 1; i <= bit->rows; i += i & (-i))
        for (int j = c + 1; j <= bit->cols; j += j & (-j))
            bit->tree[i][j] += val;
}

long long bit2d_query(const BIT2D* bit, int r, int c) {
    long long s = 0;
    for (int i = r + 1; i > 0; i -= i & (-i))
        for (int j = c + 1; j > 0; j -= j & (-j))
            s += bit->tree[i][j];
    return s;
}

void bit2d_free(BIT2D* bit) {
    for (int i = 0; i <= bit->rows; i++) free(bit->tree[i]);
    free(bit->tree); free(bit);
}

int* binary_indexed_tree_2d(int arr[], int size, int* out_size) {
    if (size < 2) {
        *out_size = 0;
        return NULL;
    }

    int rows = arr[0];
    int cols = arr[1];
    int matrix_cells = rows * cols;
    if (rows < 0 || cols < 0 || size < 2 + matrix_cells) {
        *out_size = 0;
        return NULL;
    }

    int remaining = size - 2 - matrix_cells;
    if (remaining < 0 || (remaining % 4) != 0) {
        *out_size = 0;
        return NULL;
    }

    int q = remaining / 4;
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    if (!result) {
        *out_size = 0;
        return NULL;
    }

    BIT2D* bit = bit2d_create(rows, cols);
    int pos = 2;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            int v = arr[pos++];
            if (v) {
                bit2d_update(bit, r, c, v);
            }
        }
    }

    int result_count = 0;
    for (int i = 0; i < q; i++) {
        int t = arr[pos++];
        int r = arr[pos++];
        int c = arr[pos++];
        int v = arr[pos++];
        if (t == 1) {
            bit2d_update(bit, r, c, v);
        } else {
            result[result_count++] = (int)bit2d_query(bit, r, c);
        }
    }

    bit2d_free(bit);
    *out_size = result_count;
    return result;
}

int main(void) {
    int rows, cols;
    scanf("%d %d", &rows, &cols);
    BIT2D* bit = bit2d_create(rows, cols);
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            int v; scanf("%d", &v);
            if (v) bit2d_update(bit, r, c, v);
        }
    int q; scanf("%d", &q);
    int first = 1;
    for (int i = 0; i < q; i++) {
        int t, r, c, v; scanf("%d %d %d %d", &t, &r, &c, &v);
        if (t == 1) bit2d_update(bit, r, c, v);
        else { if (!first) printf(" "); printf("%lld", bit2d_query(bit, r, c)); first = 0; }
    }
    printf("\n");
    bit2d_free(bit);
    return 0;
}
