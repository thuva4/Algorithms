#include "suffix_tree.h"
#include <stdlib.h>
#include <string.h>

static int* g_r;
static int g_n2, g_k2;

static int cmp_sa(const void* a, const void* b) {
    int ia = *(const int*)a, ib = *(const int*)b;
    if (g_r[ia] != g_r[ib]) return g_r[ia] - g_r[ib];
    int ra = ia + g_k2 < g_n2 ? g_r[ia + g_k2] : -1;
    int rb = ib + g_k2 < g_n2 ? g_r[ib + g_k2] : -1;
    return ra - rb;
}

int suffix_tree(int* arr, int n) {
    if (n == 0) return 0;
    int* sa = (int*)malloc(n * sizeof(int));
    int* rank_a = (int*)malloc(n * sizeof(int));
    int* tmp = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) { sa[i] = i; rank_a[i] = arr[i]; }
    g_n2 = n;
    for (int k = 1; k < n; k *= 2) {
        g_r = rank_a; g_k2 = k;
        qsort(sa, n, sizeof(int), cmp_sa);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            tmp[sa[i]] = tmp[sa[i-1]];
            int p0 = rank_a[sa[i-1]], c0 = rank_a[sa[i]];
            int p1 = sa[i-1]+k<n ? rank_a[sa[i-1]+k] : -1;
            int c1 = sa[i]+k<n ? rank_a[sa[i]+k] : -1;
            if (p0 != c0 || p1 != c1) tmp[sa[i]]++;
        }
        memcpy(rank_a, tmp, n * sizeof(int));
        if (rank_a[sa[n-1]] == n-1) break;
    }
    int* invSa = (int*)malloc(n * sizeof(int));
    int* lcp = (int*)calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) invSa[sa[i]] = i;
    int h = 0;
    for (int i = 0; i < n; i++) {
        if (invSa[i] > 0) {
            int j = sa[invSa[i]-1];
            while (i+h < n && j+h < n && arr[i+h] == arr[j+h]) h++;
            lcp[invSa[i]] = h;
            if (h > 0) h--;
        } else { h = 0; }
    }
    long long total = (long long)n * (n+1) / 2;
    for (int i = 0; i < n; i++) total -= lcp[i];
    free(sa); free(rank_a); free(tmp); free(invSa); free(lcp);
    return (int)total;
}
