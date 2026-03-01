#include <stdio.h>
#include <stdlib.h>
#include "minimum_spanning_tree_boruvka.h"

static int par[10001], rnk[10001];

static int find(int x) {
    while (par[x] != x) { par[x] = par[par[x]]; x = par[x]; }
    return x;
}

static int unite(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return 0;
    if (rnk[rx] < rnk[ry]) { int t = rx; rx = ry; ry = t; }
    par[ry] = rx;
    if (rnk[rx] == rnk[ry]) rnk[rx]++;
    return 1;
}

/**
 * Find the minimum spanning tree using Boruvka's algorithm.
 *
 * Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
 * Returns: total weight of the MST
 */
int minimum_spanning_tree_boruvka(int* arr, int size) {
    int idx = 0;
    int n = arr[idx++];
    int m = arr[idx++];
    int* eu = (int*)malloc(m * sizeof(int));
    int* ev = (int*)malloc(m * sizeof(int));
    int* ew = (int*)malloc(m * sizeof(int));
    int i;

    for (i = 0; i < m; i++) {
        eu[i] = arr[idx++];
        ev[i] = arr[idx++];
        ew[i] = arr[idx++];
    }

    for (i = 0; i < n; i++) { par[i] = i; rnk[i] = 0; }

    int totalWeight = 0;
    int numComponents = n;

    while (numComponents > 1) {
        int* cheapest = (int*)malloc(n * sizeof(int));
        for (i = 0; i < n; i++) cheapest[i] = -1;

        for (i = 0; i < m; i++) {
            int ru = find(eu[i]), rv = find(ev[i]);
            if (ru == rv) continue;
            if (cheapest[ru] == -1 || ew[i] < ew[cheapest[ru]])
                cheapest[ru] = i;
            if (cheapest[rv] == -1 || ew[i] < ew[cheapest[rv]])
                cheapest[rv] = i;
        }

        for (i = 0; i < n; i++) {
            if (cheapest[i] != -1) {
                if (unite(eu[cheapest[i]], ev[cheapest[i]])) {
                    totalWeight += ew[cheapest[i]];
                    numComponents--;
                }
            }
        }
        free(cheapest);
    }

    free(eu); free(ev); free(ew);
    return totalWeight;
}

int main() {
    int a1[] = {3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3};
    printf("%d\n", minimum_spanning_tree_boruvka(a1, 11)); /* 3 */

    int a2[] = {4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4};
    printf("%d\n", minimum_spanning_tree_boruvka(a2, 17)); /* 19 */

    int a3[] = {2, 1, 0, 1, 7};
    printf("%d\n", minimum_spanning_tree_boruvka(a3, 5)); /* 7 */

    int a4[] = {4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3};
    printf("%d\n", minimum_spanning_tree_boruvka(a4, 11)); /* 6 */

    return 0;
}
