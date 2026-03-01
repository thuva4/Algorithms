#include <stdlib.h>

int knapsack(int weights[], int values[], int capacity) {
    if (capacity <= 0) {
        return 0;
    }

    int item_count = 0;
    while (weights[item_count] != 0 || values[item_count] != 0) {
        item_count++;
    }

    int *dp = (int *)calloc((size_t)capacity + 1, sizeof(int));
    if (!dp) {
        return 0;
    }

    for (int i = 0; i < item_count; i++) {
        int weight = weights[i];
        int value = values[i];
        if (weight <= 0) {
            continue;
        }
        for (int w = capacity; w >= weight; w--) {
            int candidate = dp[w - weight] + value;
            if (candidate > dp[w]) {
                dp[w] = candidate;
            }
        }
    }

    int result = dp[capacity];
    free(dp);
    return result;
}
