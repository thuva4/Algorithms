#include "optimal_bst.h"
#include <stdlib.h>
#include <limits.h>

int optimal_bst(int* arr, int len) {
    int n = arr[0];
    int* freq = arr + 1;

    int** cost = (int**)malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        cost[i] = (int*)calloc(n, sizeof(int));
        cost[i][i] = freq[i];
    }

    for (int l = 2; l <= n; l++) {
        for (int i = 0; i <= n - l; i++) {
            int j = i + l - 1;
            cost[i][j] = INT_MAX;
            int freqSum = 0;
            for (int k = i; k <= j; k++) freqSum += freq[k];

            for (int r = i; r <= j; r++) {
                int left = r > i ? cost[i][r-1] : 0;
                int right = r < j ? cost[r+1][j] : 0;
                int c = left + right + freqSum;
                if (c < cost[i][j]) cost[i][j] = c;
            }
        }
    }

    int result = cost[0][n-1];
    for (int i = 0; i < n; i++) free(cost[i]);
    free(cost);
    return result;
}
