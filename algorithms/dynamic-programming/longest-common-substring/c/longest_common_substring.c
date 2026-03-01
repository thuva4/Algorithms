#include <stdio.h>

/**
 * Find the length of the longest contiguous subarray common to both arrays.
 *
 * arr1: first array of integers
 * arr2: second array of integers
 * n: length of arr1
 * m: length of arr2
 * Returns: length of the longest common contiguous subarray
 */
int longest_common_substring(int arr1[], int n, int arr2[], int m) {
    int max_len = 0;
    int dp[n + 1][m + 1];
    int i, j;

    for (i = 0; i <= n; i++)
        for (j = 0; j <= m; j++)
            dp[i][j] = 0;

    for (i = 1; i <= n; i++) {
        for (j = 1; j <= m; j++) {
            if (arr1[i - 1] == arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > max_len) {
                    max_len = dp[i][j];
                }
            } else {
                dp[i][j] = 0;
            }
        }
    }

    return max_len;
}

int main() {
    int a1[] = {1, 2, 3, 4, 5};
    int a2[] = {3, 4, 5, 6, 7};
    printf("%d\n", longest_common_substring(a1, 5, a2, 5));  /* 3 */

    int b1[] = {1, 2, 3};
    int b2[] = {4, 5, 6};
    printf("%d\n", longest_common_substring(b1, 3, b2, 3));  /* 0 */

    int c1[] = {1, 2, 3, 4};
    int c2[] = {1, 2, 3, 4};
    printf("%d\n", longest_common_substring(c1, 4, c2, 4));  /* 4 */

    int d1[] = {1};
    int d2[] = {1};
    printf("%d\n", longest_common_substring(d1, 1, d2, 1));  /* 1 */

    int e1[] = {1, 2, 3, 2, 1};
    int e2[] = {3, 2, 1, 4, 7};
    printf("%d\n", longest_common_substring(e1, 5, e2, 5));  /* 3 */

    return 0;
}
