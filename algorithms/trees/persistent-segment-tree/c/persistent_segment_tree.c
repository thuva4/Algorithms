#include <stdio.h>
#include <stdlib.h>
#include "persistent_segment_tree.h"

#define MAXNODES 2000000
static long long val[MAXNODES];
static int lc[MAXNODES], rc[MAXNODES];
static int cnt = 0;

static int new_node(long long v, int l, int r) {
    int id = cnt++;
    val[id] = v; lc[id] = l; rc[id] = r;
    return id;
}

static int do_build(const int* a, int s, int e) {
    if (s == e) return new_node(a[s], 0, 0);
    int m = (s + e) / 2;
    int l = do_build(a, s, m), r = do_build(a, m + 1, e);
    return new_node(val[l] + val[r], l, r);
}

int pst_build(const int* arr, int n) { return do_build(arr, 0, n - 1); }

static int do_update(int nd, int s, int e, int idx, int v) {
    if (s == e) return new_node(v, 0, 0);
    int m = (s + e) / 2;
    if (idx <= m) {
        int nl = do_update(lc[nd], s, m, idx, v);
        return new_node(val[nl] + val[rc[nd]], nl, rc[nd]);
    } else {
        int nr = do_update(rc[nd], m + 1, e, idx, v);
        return new_node(val[lc[nd]] + val[nr], lc[nd], nr);
    }
}

int pst_update(int root, int n, int idx, int v) { return do_update(root, 0, n - 1, idx, v); }

static long long do_query(int nd, int s, int e, int l, int r) {
    if (r < s || e < l) return 0;
    if (l <= s && e <= r) return val[nd];
    int m = (s + e) / 2;
    return do_query(lc[nd], s, m, l, r) + do_query(rc[nd], m + 1, e, l, r);
}

long long pst_query(int root, int n, int l, int r) { return do_query(root, 0, n - 1, l, r); }

int* persistent_segment_tree(int arr[], int size, int* out_size) {
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
    if (remaining < 0 || (remaining % 4) != 0) {
        *out_size = 0;
        return NULL;
    }

    int q = remaining / 4;
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    int* roots = (int*)malloc((q + 2) * sizeof(int));
    if (!result || !roots) {
        free(result);
        free(roots);
        *out_size = 0;
        return NULL;
    }

    cnt = 0;
    int root_count = 0;
    roots[root_count++] = pst_build(arr + 1, n);

    int pos = 1 + n;
    int result_count = 0;
    for (int i = 0; i < q; i++) {
        int t = arr[pos++];
        int a = arr[pos++];
        int b = arr[pos++];
        int c = arr[pos++];
        if (t == 1) {
            roots[root_count++] = pst_update(roots[a], n, b, c);
        } else {
            result[result_count++] = (int)pst_query(roots[a], n, b, c);
        }
    }

    free(roots);
    *out_size = result_count;
    return result;
}

int main(void) {
    int n; scanf("%d", &n);
    int* a = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int* roots = (int*)malloc(200000 * sizeof(int));
    int nroots = 0;
    roots[nroots++] = pst_build(a, n);
    int q; scanf("%d", &q);
    int first = 1;
    for (int i = 0; i < q; i++) {
        int t, a1, b1, c1; scanf("%d %d %d %d", &t, &a1, &b1, &c1);
        if (t == 1) roots[nroots++] = pst_update(roots[a1], n, b1, c1);
        else { if (!first) printf(" "); printf("%lld", pst_query(roots[a1], n, b1, c1)); first = 0; }
    }
    printf("\n");
    free(a); free(roots);
    return 0;
}
