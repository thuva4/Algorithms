#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "segment_tree_lazy.h"

static void build(SegTreeLazy* st, const int* a, int nd, int s, int e) {
    if (s == e) { st->tree[nd] = a[s]; return; }
    int m = (s + e) / 2;
    build(st, a, 2*nd, s, m); build(st, a, 2*nd+1, m+1, e);
    st->tree[nd] = st->tree[2*nd] + st->tree[2*nd+1];
}

static void apply_node(SegTreeLazy* st, int nd, int s, int e, long long v) {
    st->tree[nd] += v * (e - s + 1); st->lazy[nd] += v;
}

static void push_down(SegTreeLazy* st, int nd, int s, int e) {
    if (st->lazy[nd]) {
        int m = (s + e) / 2;
        apply_node(st, 2*nd, s, m, st->lazy[nd]);
        apply_node(st, 2*nd+1, m+1, e, st->lazy[nd]);
        st->lazy[nd] = 0;
    }
}

static void do_update(SegTreeLazy* st, int nd, int s, int e, int l, int r, long long v) {
    if (r < s || e < l) return;
    if (l <= s && e <= r) { apply_node(st, nd, s, e, v); return; }
    push_down(st, nd, s, e);
    int m = (s + e) / 2;
    do_update(st, 2*nd, s, m, l, r, v);
    do_update(st, 2*nd+1, m+1, e, l, r, v);
    st->tree[nd] = st->tree[2*nd] + st->tree[2*nd+1];
}

static long long do_query(SegTreeLazy* st, int nd, int s, int e, int l, int r) {
    if (r < s || e < l) return 0;
    if (l <= s && e <= r) return st->tree[nd];
    push_down(st, nd, s, e);
    int m = (s + e) / 2;
    return do_query(st, 2*nd, s, m, l, r) + do_query(st, 2*nd+1, m+1, e, l, r);
}

SegTreeLazy* seg_lazy_build(const int* arr, int n) {
    SegTreeLazy* st = (SegTreeLazy*)malloc(sizeof(SegTreeLazy));
    st->n = n;
    st->tree = (long long*)calloc(4 * n, sizeof(long long));
    st->lazy = (long long*)calloc(4 * n, sizeof(long long));
    build(st, arr, 1, 0, n - 1);
    return st;
}

void seg_lazy_update(SegTreeLazy* st, int l, int r, long long val) {
    do_update(st, 1, 0, st->n - 1, l, r, val);
}

long long seg_lazy_query(SegTreeLazy* st, int l, int r) {
    return do_query(st, 1, 0, st->n - 1, l, r);
}

void seg_lazy_free(SegTreeLazy* st) {
    free(st->tree); free(st->lazy); free(st);
}

int* segment_tree_lazy(int arr[], int size, int* out_size) {
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
    if (!result) {
        *out_size = 0;
        return NULL;
    }

    SegTreeLazy* st = seg_lazy_build(arr + 1, n);
    int pos = 1 + n;
    int result_count = 0;
    for (int i = 0; i < q; i++) {
        int t = arr[pos++];
        int l = arr[pos++];
        int r = arr[pos++];
        int v = arr[pos++];
        if (t == 1) {
            seg_lazy_update(st, l, r, v);
        } else {
            result[result_count++] = (int)seg_lazy_query(st, l, r);
        }
    }

    seg_lazy_free(st);
    *out_size = result_count;
    return result;
}

int main(void) {
    int n; scanf("%d", &n);
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    SegTreeLazy* st = seg_lazy_build(arr, n);
    int q; scanf("%d", &q);
    int first = 1;
    for (int i = 0; i < q; i++) {
        int t, l, r, v; scanf("%d %d %d %d", &t, &l, &r, &v);
        if (t == 1) seg_lazy_update(st, l, r, v);
        else { if (!first) printf(" "); printf("%lld", seg_lazy_query(st, l, r)); first = 0; }
    }
    printf("\n");
    seg_lazy_free(st); free(arr);
    return 0;
}
