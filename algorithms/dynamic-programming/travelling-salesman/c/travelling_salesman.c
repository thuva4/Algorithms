#include "travelling_salesman.h"
#include <stdlib.h>
#include <limits.h>

int travelling_salesman(int* arr, int len) {
    int n = arr[0];
    if (n <= 1) return 0;
    int INF = INT_MAX / 2;
    int full = (1 << n) - 1;
    int* dp = (int*)malloc((1 << n) * n * sizeof(int));
    for (int i = 0; i < (1 << n) * n; i++) dp[i] = INF;
    dp[1 * n + 0] = 0;

    for (int mask = 1; mask <= full; mask++)
        for (int i = 0; i < n; i++) {
            if (dp[mask*n+i] >= INF || !(mask & (1<<i))) continue;
            for (int j = 0; j < n; j++) {
                if (mask & (1<<j)) continue;
                int nm = mask | (1<<j);
                int cost = dp[mask*n+i] + arr[1+i*n+j];
                if (cost < dp[nm*n+j]) dp[nm*n+j] = cost;
            }
        }

    int result = INF;
    for (int i = 0; i < n; i++) {
        int v = dp[full*n+i] + arr[1+i*n+0];
        if (v < result) result = v;
    }
    free(dp);
    return result;
}
