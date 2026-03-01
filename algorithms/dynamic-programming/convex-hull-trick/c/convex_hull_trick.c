#include <stdio.h>
#include <stdlib.h>
#include "convex_hull_trick.h"

typedef struct { long long m, b; } Line;

static void convex_hull_trick_impl(int n, long long* ms, long long* bs,
                                   int q, long long* queries, long long* results) {
    for (int i = 0; i < q; i++) {
        long long x = queries[i];
        long long best = 0;
        for (int j = 0; j < n; j++) {
            long long value = (ms[j] * x) + bs[j];
            if (j == 0 || value < best) {
                best = value;
            }
        }
        results[i] = best;
    }
}

int main(void) {
    int n;
    scanf("%d", &n);
    long long* ms = (long long*)malloc(n * sizeof(long long));
    long long* bs = (long long*)malloc(n * sizeof(long long));
    for (int i = 0; i < n; i++) scanf("%lld %lld", &ms[i], &bs[i]);
    int q;
    scanf("%d", &q);
    long long* queries = (long long*)malloc(q * sizeof(long long));
    long long* results = (long long*)malloc(q * sizeof(long long));
    for (int i = 0; i < q; i++) scanf("%lld", &queries[i]);
    convex_hull_trick_impl(n, ms, bs, q, queries, results);
    for (int i = 0; i < q; i++) {
        if (i) printf(" ");
        printf("%lld", results[i]);
    }
    printf("\n");
    free(ms); free(bs); free(queries); free(results);
    return 0;
}

int* convex_hull_trick(int arr[], int size, int* out_size) {
    if (size < 1) {
        *out_size = 0;
        return NULL;
    }

    int n = arr[0];
    if (n < 0 || size < 1 + (2 * n)) {
        *out_size = 0;
        return NULL;
    }

    int q = size - 1 - (2 * n);
    if (q < 0) {
        *out_size = 0;
        return NULL;
    }

    long long* ms = (long long*)malloc((n > 0 ? n : 1) * sizeof(long long));
    long long* bs = (long long*)malloc((n > 0 ? n : 1) * sizeof(long long));
    long long* queries = (long long*)malloc((q > 0 ? q : 1) * sizeof(long long));
    long long* tmp = (long long*)malloc((q > 0 ? q : 1) * sizeof(long long));
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    if (!ms || !bs || !queries || !tmp || !result) {
        free(ms); free(bs); free(queries); free(tmp); free(result);
        *out_size = 0;
        return NULL;
    }

    for (int i = 0; i < n; i++) {
        ms[i] = arr[1 + (2 * i)];
        bs[i] = arr[1 + (2 * i) + 1];
    }
    for (int i = 0; i < q; i++) {
        queries[i] = arr[1 + (2 * n) + i];
    }

    convex_hull_trick_impl(n, ms, bs, q, queries, tmp);
    for (int i = 0; i < q; i++) {
        result[i] = (int)tmp[i];
    }

    free(ms);
    free(bs);
    free(queries);
    free(tmp);
    *out_size = q;
    return result;
}
