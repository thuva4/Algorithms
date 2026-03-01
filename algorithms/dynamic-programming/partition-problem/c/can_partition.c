#include "can_partition.h"
#include <string.h>

#define MAX_SUM 100000

static int dp[MAX_SUM + 1];

int can_partition(int arr[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) total += arr[i];
    if (total % 2 != 0) return 0;
    int target = total / 2;

    memset(dp, 0, sizeof(int) * (target + 1));
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        for (int j = target; j >= arr[i]; j--) {
            if (dp[j - arr[i]]) dp[j] = 1;
        }
    }
    return dp[target];
}
