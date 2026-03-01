#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "knuth_optimization.h"

int knuth_optimization(int n, const int* freq) {
    int** dp = (int**)malloc(n * sizeof(int*));
    int** opt = (int**)malloc(n * sizeof(int*));
    int* prefix = (int*)calloc(n + 1, sizeof(int));

    for (int i = 0; i < n; i++) {
        dp[i] = (int*)calloc(n, sizeof(int));
        opt[i] = (int*)calloc(n, sizeof(int));
        prefix[i + 1] = prefix[i] + freq[i];
    }

    for (int i = 0; i < n; i++) {
        dp[i][i] = freq[i];
        opt[i][i] = i;
    }

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            int cost_sum = prefix[j + 1] - prefix[i];
            int lo = opt[i][j - 1];
            int hi = (i + 1 <= j) ? opt[i + 1][j] : j;
            for (int k = lo; k <= hi; k++) {
                int left = (k > i) ? dp[i][k - 1] : 0;
                int right = (k < j) ? dp[k + 1][j] : 0;
                int val = left + right + cost_sum;
                if (val < dp[i][j]) {
                    dp[i][j] = val;
                    opt[i][j] = k;
                }
            }
        }
    }

    int result = dp[0][n - 1];
    for (int i = 0; i < n; i++) { free(dp[i]); free(opt[i]); }
    free(dp); free(opt); free(prefix);
    return result;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int* freq = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &freq[i]);
    printf("%d\n", knuth_optimization(n, freq));
    free(freq);
    return 0;
}
