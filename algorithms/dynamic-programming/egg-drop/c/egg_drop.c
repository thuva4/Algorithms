#include "egg_drop.h"
#include <limits.h>

int egg_drop(const int* arr, int n) {
    int eggs = arr[0], floors = arr[1];
    int dp[100][1000];
    for (int e = 0; e <= eggs; e++)
        for (int f = 0; f <= floors; f++)
            dp[e][f] = 0;
    for (int f = 1; f <= floors; f++) dp[1][f] = f;
    for (int e = 2; e <= eggs; e++) {
        for (int f = 1; f <= floors; f++) {
            dp[e][f] = INT_MAX;
            for (int x = 1; x <= f; x++) {
                int a = dp[e-1][x-1], b = dp[e][f-x];
                int worst = 1 + (a > b ? a : b);
                if (worst < dp[e][f]) dp[e][f] = worst;
            }
        }
    }
    return dp[eggs][floors];
}
