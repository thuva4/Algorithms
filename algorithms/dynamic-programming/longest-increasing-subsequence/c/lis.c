#include <stdio.h>

int lis(int arr[], int n) {
    if (n == 0) return 0;

    int dp[n];
    int i, j, max_len = 1;

    for (i = 0; i < n; i++)
        dp[i] = 1;

    for (i = 1; i < n; i++) {
        for (j = 0; j < i; j++) {
            if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
            }
        }
        if (dp[i] > max_len)
            max_len = dp[i];
    }

    return max_len;
}

int main() {
    int arr[] = {10, 9, 2, 5, 3, 7, 101, 18};
    int n = sizeof(arr) / sizeof(arr[0]);
    printf("Length of LIS is %d\n", lis(arr, n)); // 4
    return 0;
}
