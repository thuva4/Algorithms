#include <stdio.h>
#include <stdlib.h>
#include "sparse_table.h"

static int min_val(int a, int b) { return a < b ? a : b; }

SparseTable* sparse_table_build(const int* arr, int n) {
    SparseTable* st = (SparseTable*)malloc(sizeof(SparseTable));
    st->n = n;
    st->k = 1;
    while ((1 << st->k) <= n) st->k++;

    st->table = (int**)malloc(st->k * sizeof(int*));
    for (int j = 0; j < st->k; j++)
        st->table[j] = (int*)malloc(n * sizeof(int));

    st->lg = (int*)calloc(n + 1, sizeof(int));
    for (int i = 2; i <= n; i++) st->lg[i] = st->lg[i/2] + 1;

    for (int i = 0; i < n; i++) st->table[0][i] = arr[i];
    for (int j = 1; j < st->k; j++)
        for (int i = 0; i + (1 << j) <= n; i++)
            st->table[j][i] = min_val(st->table[j-1][i], st->table[j-1][i + (1 << (j-1))]);

    return st;
}

int sparse_table_query(const SparseTable* st, int l, int r) {
    int k = st->lg[r - l + 1];
    return min_val(st->table[k][l], st->table[k][r - (1 << k) + 1]);
}

void sparse_table_free(SparseTable* st) {
    for (int j = 0; j < st->k; j++) free(st->table[j]);
    free(st->table);
    free(st->lg);
    free(st);
}

int* sparse_table(int arr[], int size, int* out_size) {
    if (size < 1) {
        *out_size = 0;
        return NULL;
    }

    int n = arr[0];
    if (n < 0 || size < 1 + n) {
        *out_size = 0;
        return NULL;
    }

    int remaining = size - 1 - n;
    if (remaining < 0 || (remaining % 2) != 0) {
        *out_size = 0;
        return NULL;
    }

    int q = remaining / 2;
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    if (!result) {
        *out_size = 0;
        return NULL;
    }

    SparseTable* st = sparse_table_build(arr + 1, n);
    for (int i = 0; i < q; i++) {
        int l = arr[1 + n + (2 * i)];
        int r = arr[1 + n + (2 * i) + 1];
        result[i] = sparse_table_query(st, l, r);
    }
    sparse_table_free(st);
    *out_size = q;
    return result;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    SparseTable* st = sparse_table_build(arr, n);
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int l, r;
        scanf("%d %d", &l, &r);
        if (i) printf(" ");
        printf("%d", sparse_table_query(st, l, r));
    }
    printf("\n");
    sparse_table_free(st);
    free(arr);
    return 0;
}
