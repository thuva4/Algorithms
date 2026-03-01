#include "prims_fibonacci_heap.h"
#include <limits.h>
#include <string.h>

#define MAX_V 1000

int prims_fibonacci_heap(int arr[], int size) {
    int n = arr[0], m = arr[1];
    /* Simple O(V^2) Prim's for C */
    int w_mat[MAX_V][MAX_V];
    int i, j;
    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++)
            w_mat[i][j] = INT_MAX;

    for (i = 0; i < m; i++) {
        int u = arr[2+3*i], v = arr[2+3*i+1], w = arr[2+3*i+2];
        if (w < w_mat[u][v]) { w_mat[u][v] = w; w_mat[v][u] = w; }
    }

    int in_mst[MAX_V], key[MAX_V];
    memset(in_mst, 0, sizeof(int) * n);
    for (i = 0; i < n; i++) key[i] = INT_MAX;
    key[0] = 0;
    int total = 0;

    for (i = 0; i < n; i++) {
        int u = -1;
        for (j = 0; j < n; j++) {
            if (!in_mst[j] && (u == -1 || key[j] < key[u])) u = j;
        }
        in_mst[u] = 1;
        total += key[u];
        for (j = 0; j < n; j++) {
            if (!in_mst[j] && w_mat[u][j] < key[j]) {
                key[j] = w_mat[u][j];
            }
        }
    }

    return total;
}
