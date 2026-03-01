#include "hamiltonian_path.h"
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

int hamiltonian_path(int* arr, int len) {
    int n = arr[0], m = arr[1];
    if (n <= 1) return 1;
    bool* adj = (bool*)calloc(n * n, sizeof(bool));
    for (int i = 0; i < m; i++) {
        int u = arr[2+2*i], v = arr[3+2*i];
        adj[u*n+v] = true; adj[v*n+u] = true;
    }
    int full = (1 << n) - 1;
    bool* dp = (bool*)calloc((1 << n) * n, sizeof(bool));
    for (int i = 0; i < n; i++) dp[(1 << i)*n + i] = true;
    for (int mask = 1; mask <= full; mask++) {
        for (int i = 0; i < n; i++) {
            if (!dp[mask*n+i]) continue;
            for (int j = 0; j < n; j++) {
                if (!(mask & (1 << j)) && adj[i*n+j])
                    dp[(mask|(1<<j))*n+j] = true;
            }
        }
    }
    int result = 0;
    for (int i = 0; i < n; i++) if (dp[full*n+i]) { result = 1; break; }
    free(adj); free(dp);
    return result;
}
