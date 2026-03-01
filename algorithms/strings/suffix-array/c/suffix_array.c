#include "suffix_array.h"
#include <stdlib.h>
#include <string.h>

static int* g_rank;
static int g_n, g_k;

static int cmp(const void* a, const void* b) {
    int ia = *(const int*)a, ib = *(const int*)b;
    if (g_rank[ia] != g_rank[ib]) return g_rank[ia] - g_rank[ib];
    int ra = ia + g_k < g_n ? g_rank[ia + g_k] : -1;
    int rb = ib + g_k < g_n ? g_rank[ib + g_k] : -1;
    return ra - rb;
}

int* suffix_array(int* arr, int n, int* out_size) {
    *out_size = n;
    if (n == 0) return NULL;
    int* sa = (int*)malloc(n * sizeof(int));
    int* rank_arr = (int*)malloc(n * sizeof(int));
    int* tmp = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        sa[i] = i;
        rank_arr[i] = arr[i];
    }
    g_n = n;
    for (int k = 1; k < n; k *= 2) {
        g_rank = rank_arr;
        g_k = k;
        qsort(sa, n, sizeof(int), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            tmp[sa[i]] = tmp[sa[i - 1]];
            int prev0 = rank_arr[sa[i - 1]];
            int prev1 = sa[i - 1] + k < n ? rank_arr[sa[i - 1] + k] : -1;
            int cur0 = rank_arr[sa[i]];
            int cur1 = sa[i] + k < n ? rank_arr[sa[i] + k] : -1;
            if (prev0 != cur0 || prev1 != cur1) tmp[sa[i]]++;
        }
        memcpy(rank_arr, tmp, n * sizeof(int));
        if (rank_arr[sa[n - 1]] == n - 1) break;
    }
    free(rank_arr);
    free(tmp);
    return sa;
}
