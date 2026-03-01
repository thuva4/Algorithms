#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "merge_sort_tree.h"

static int* merge_arrays(const int* a, int na, const int* b, int nb) {
    int* r = (int*)malloc((na + nb) * sizeof(int));
    int i = 0, j = 0, k = 0;
    while (i < na && j < nb) r[k++] = a[i] <= b[j] ? a[i++] : b[j++];
    while (i < na) r[k++] = a[i++];
    while (j < nb) r[k++] = b[j++];
    return r;
}

static void build(MergeSortTree* mst, const int* a, int nd, int s, int e) {
    if (s == e) {
        mst->tree[nd] = (int*)malloc(sizeof(int));
        mst->tree[nd][0] = a[s]; mst->sizes[nd] = 1; return;
    }
    int m = (s + e) / 2;
    build(mst, a, 2*nd, s, m); build(mst, a, 2*nd+1, m+1, e);
    mst->sizes[nd] = mst->sizes[2*nd] + mst->sizes[2*nd+1];
    mst->tree[nd] = merge_arrays(mst->tree[2*nd], mst->sizes[2*nd],
                                  mst->tree[2*nd+1], mst->sizes[2*nd+1]);
}

static int upper_bound(const int* arr, int n, int k) {
    int lo = 0, hi = n;
    while (lo < hi) { int m = (lo + hi) / 2; if (arr[m] <= k) lo = m + 1; else hi = m; }
    return lo;
}

static int do_query(const MergeSortTree* mst, int nd, int s, int e, int l, int r, int k) {
    if (r < s || e < l) return 0;
    if (l <= s && e <= r) return upper_bound(mst->tree[nd], mst->sizes[nd], k);
    int m = (s + e) / 2;
    return do_query(mst, 2*nd, s, m, l, r, k) + do_query(mst, 2*nd+1, m+1, e, l, r, k);
}

MergeSortTree* mst_build(const int* arr, int n) {
    MergeSortTree* mst = (MergeSortTree*)malloc(sizeof(MergeSortTree));
    mst->n = n;
    mst->tree = (int**)calloc(4 * n, sizeof(int*));
    mst->sizes = (int*)calloc(4 * n, sizeof(int));
    build(mst, arr, 1, 0, n - 1);
    return mst;
}

int mst_count_leq(const MergeSortTree* mst, int l, int r, int k) {
    return do_query(mst, 1, 0, mst->n - 1, l, r, k);
}

void mst_free(MergeSortTree* mst) {
    for (int i = 0; i < 4 * mst->n; i++) if (mst->tree[i]) free(mst->tree[i]);
    free(mst->tree); free(mst->sizes); free(mst);
}

int* merge_sort_tree(int arr[], int size, int* out_size) {
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
    if (remaining < 0 || (remaining % 3) != 0) {
        *out_size = 0;
        return NULL;
    }

    int q = remaining / 3;
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    if (!result) {
        *out_size = 0;
        return NULL;
    }

    MergeSortTree* mst = mst_build(arr + 1, n);
    for (int i = 0; i < q; i++) {
        int base = 1 + n + (3 * i);
        result[i] = mst_count_leq(mst, arr[base], arr[base + 1], arr[base + 2]);
    }
    mst_free(mst);
    *out_size = q;
    return result;
}

int main(void) {
    int n; scanf("%d", &n);
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    MergeSortTree* mst = mst_build(arr, n);
    int q; scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int l, r, k; scanf("%d %d %d", &l, &r, &k);
        if (i) printf(" ");
        printf("%d", mst_count_leq(mst, l, r, k));
    }
    printf("\n");
    mst_free(mst); free(arr);
    return 0;
}
