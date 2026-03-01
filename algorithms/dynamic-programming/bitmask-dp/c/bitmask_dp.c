#include <stdio.h>
#include <limits.h>
#include "bitmask_dp.h"

static int dp_arr[1 << 20];

static int popcount(int x) {
    int count = 0;
    while (x) { count += x & 1; x >>= 1; }
    return count;
}

int bitmask_dp(int n, int cost[][20]) {
    int total = 1 << n;
    for (int i = 0; i < total; i++) dp_arr[i] = INT_MAX;
    dp_arr[0] = 0;

    for (int mask = 0; mask < total; mask++) {
        if (dp_arr[mask] == INT_MAX) continue;
        int worker = popcount(mask);
        if (worker >= n) continue;
        for (int job = 0; job < n; job++) {
            if (!(mask & (1 << job))) {
                int new_mask = mask | (1 << job);
                int new_cost = dp_arr[mask] + cost[worker][job];
                if (new_cost < dp_arr[new_mask]) {
                    dp_arr[new_mask] = new_cost;
                }
            }
        }
    }

    return dp_arr[total - 1];
}

int main(void) {
    int n;
    scanf("%d", &n);
    int cost[20][20];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &cost[i][j]);
    printf("%d\n", bitmask_dp(n, cost));
    return 0;
}
