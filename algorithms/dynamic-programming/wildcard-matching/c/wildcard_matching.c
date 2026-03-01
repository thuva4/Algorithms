#include <stdio.h>
#include <stdlib.h>
#include "wildcard_matching.h"

int wildcard_matching(int* arr, int size) {
    int idx = 0;
    int tlen = arr[idx++];
    int* text = arr + idx; idx += tlen;
    int plen = arr[idx++];
    int* pattern = arr + idx;
    int i, j;

    int** dp = (int**)calloc(tlen + 1, sizeof(int*));
    for (i = 0; i <= tlen; i++) dp[i] = (int*)calloc(plen + 1, sizeof(int));
    dp[0][0] = 1;
    for (j = 1; j <= plen; j++)
        if (pattern[j-1] == 0) dp[0][j] = dp[0][j-1];

    for (i = 1; i <= tlen; i++)
        for (j = 1; j <= plen; j++) {
            if (pattern[j-1] == 0) dp[i][j] = dp[i-1][j] || dp[i][j-1];
            else if (pattern[j-1] == -1 || pattern[j-1] == text[i-1]) dp[i][j] = dp[i-1][j-1];
        }

    int result = dp[tlen][plen];
    for (i = 0; i <= tlen; i++) free(dp[i]);
    free(dp);
    return result;
}

int main() {
    int a1[] = {3, 1, 2, 3, 3, 1, 2, 3}; printf("%d\n", wildcard_matching(a1, 8));
    int a2[] = {3, 1, 2, 3, 1, 0}; printf("%d\n", wildcard_matching(a2, 6));
    int a3[] = {3, 1, 2, 3, 3, 1, -1, 3}; printf("%d\n", wildcard_matching(a3, 8));
    int a4[] = {2, 1, 2, 2, 3, 4}; printf("%d\n", wildcard_matching(a4, 6));
    int a5[] = {0, 1, 0}; printf("%d\n", wildcard_matching(a5, 3));
    return 0;
}
