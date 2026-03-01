#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "mo_algorithm.h"

static int block_size;
static const int* g_ls;
static const int* g_rs;

static int cmp_queries(const void* a, const void* b) {
    int ia = *(const int*)a, ib = *(const int*)b;
    int ba = g_ls[ia] / block_size, bb = g_ls[ib] / block_size;
    if (ba != bb) return ba - bb;
    if (ba % 2 == 0) return g_rs[ia] - g_rs[ib];
    return g_rs[ib] - g_rs[ia];
}

static void mo_algorithm_impl(int n, const int* arr, int q, const int* ls, const int* rs, long long* results) {
    block_size = (int)sqrt(n);
    if (block_size < 1) block_size = 1;
    g_ls = ls; g_rs = rs;

    int* order = (int*)malloc(q * sizeof(int));
    for (int i = 0; i < q; i++) order[i] = i;
    qsort(order, q, sizeof(int), cmp_queries);

    int curL = 0, curR = -1;
    long long curSum = 0;
    for (int i = 0; i < q; i++) {
        int idx = order[i];
        int l = ls[idx], r = rs[idx];
        while (curR < r) curSum += arr[++curR];
        while (curL > l) curSum += arr[--curL];
        while (curR > r) curSum -= arr[curR--];
        while (curL < l) curSum -= arr[curL++];
        results[idx] = curSum;
    }
    free(order);
}

int main(void) {
    int n;
    scanf("%d", &n);
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    int q;
    scanf("%d", &q);
    int* ls = (int*)malloc(q * sizeof(int));
    int* rs = (int*)malloc(q * sizeof(int));
    long long* results = (long long*)malloc(q * sizeof(long long));
    for (int i = 0; i < q; i++) scanf("%d %d", &ls[i], &rs[i]);
    mo_algorithm_impl(n, arr, q, ls, rs, results);
    for (int i = 0; i < q; i++) {
        if (i) printf(" ");
        printf("%lld", results[i]);
    }
    printf("\n");
    free(arr); free(ls); free(rs); free(results);
    return 0;
}

int* mo_algorithm(int arr[], int size, int* out_size) {
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
    int* ls = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    int* rs = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    long long* tmp = (long long*)malloc((q > 0 ? q : 1) * sizeof(long long));
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    if (!ls || !rs || !tmp || !result) {
        free(ls); free(rs); free(tmp); free(result);
        *out_size = 0;
        return NULL;
    }

    for (int i = 0; i < q; i++) {
        ls[i] = arr[1 + n + (2 * i)];
        rs[i] = arr[1 + n + (2 * i) + 1];
    }
    mo_algorithm_impl(n, arr + 1, q, ls, rs, tmp);
    for (int i = 0; i < q; i++) {
        result[i] = (int)tmp[i];
    }

    free(ls);
    free(rs);
    free(tmp);
    *out_size = q;
    return result;
}
