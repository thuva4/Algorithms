#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "disjoint_sparse_table.h"

static int high_bit(int x) {
    int r = 0;
    while ((1 << (r + 1)) <= x) r++;
    return r;
}

DisjointSparseTable* dst_build(const int* arr, int n) {
    DisjointSparseTable* dst = (DisjointSparseTable*)malloc(sizeof(DisjointSparseTable));
    dst->sz = 1; dst->levels = 0;
    while (dst->sz < n) { dst->sz <<= 1; dst->levels++; }
    if (dst->levels == 0) dst->levels = 1;

    dst->a = (long long*)calloc(dst->sz, sizeof(long long));
    for (int i = 0; i < n; i++) dst->a[i] = arr[i];

    dst->table = (long long**)malloc(dst->levels * sizeof(long long*));
    for (int i = 0; i < dst->levels; i++)
        dst->table[i] = (long long*)calloc(dst->sz, sizeof(long long));

    for (int level = 0; level < dst->levels; level++) {
        int block = 1 << (level + 1);
        int half = block >> 1;
        for (int start = 0; start < dst->sz; start += block) {
            int mid = start + half;
            dst->table[level][mid] = dst->a[mid];
            int end = start + block < dst->sz ? start + block : dst->sz;
            for (int i = mid + 1; i < end; i++)
                dst->table[level][i] = dst->table[level][i - 1] + dst->a[i];
            if (mid - 1 >= start) {
                dst->table[level][mid - 1] = dst->a[mid - 1];
                for (int i = mid - 2; i >= start; i--)
                    dst->table[level][i] = dst->table[level][i + 1] + dst->a[i];
            }
        }
    }
    return dst;
}

long long dst_query(const DisjointSparseTable* dst, int l, int r) {
    if (l == r) return dst->a[l];
    int level = high_bit(l ^ r);
    return dst->table[level][l] + dst->table[level][r];
}

void dst_free(DisjointSparseTable* dst) {
    for (int i = 0; i < dst->levels; i++) free(dst->table[i]);
    free(dst->table);
    free(dst->a);
    free(dst);
}

int* disjoint_sparse_table(int arr[], int size, int* out_size) {
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

    DisjointSparseTable* dst = dst_build(arr + 1, n);
    for (int i = 0; i < q; i++) {
        int l = arr[1 + n + (2 * i)];
        int r = arr[1 + n + (2 * i) + 1];
        result[i] = (int)dst_query(dst, l, r);
    }
    dst_free(dst);
    *out_size = q;
    return result;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    DisjointSparseTable* dst = dst_build(arr, n);
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int l, r;
        scanf("%d %d", &l, &r);
        if (i) printf(" ");
        printf("%lld", dst_query(dst, l, r));
    }
    printf("\n");
    dst_free(dst);
    free(arr);
    return 0;
}
