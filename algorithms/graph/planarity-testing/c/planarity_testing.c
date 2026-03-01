#include "planarity_testing.h"
#include <string.h>

#define MAX_V 1000

/* Simple adjacency matrix to count unique edges */
int planarity_testing(int arr[], int size) {
    int n = arr[0], m = arr[1];
    if (n < 3) return 1;

    /* Count unique edges using a simple method */
    /* For small n, use adjacency matrix */
    static int seen[MAX_V][MAX_V];
    memset(seen, 0, sizeof(seen));
    int e = 0;
    for (int i = 0; i < m; i++) {
        int u = arr[2+2*i], v = arr[2+2*i+1];
        if (u == v) continue;
        int a = u < v ? u : v;
        int b = u < v ? v : u;
        if (!seen[a][b]) {
            seen[a][b] = 1;
            e++;
        }
    }

    return e <= 3 * n - 6 ? 1 : 0;
}
