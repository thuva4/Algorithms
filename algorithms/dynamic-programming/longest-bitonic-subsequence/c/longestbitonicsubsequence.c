#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int longest_bitonic_subsequence(int arr[], int n) {
    if (n == 0) return 0;

    int lis[n], lds[n];

    for (int i = 0; i < n; i++) lis[i] = 1;
    for (int i = 0; i < n; i++) lds[i] = 1;

    /* Compute LIS from left to right */
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[j] < arr[i] && lis[j] + 1 > lis[i]) {
                lis[i] = lis[j] + 1;
            }
        }
    }

    /* Compute LDS from right to left */
    for (int i = n - 2; i >= 0; i--) {
        for (int j = n - 1; j > i; j--) {
            if (arr[j] < arr[i] && lds[j] + 1 > lds[i]) {
                lds[i] = lds[j] + 1;
            }
        }
    }

    int result = 0;
    for (int i = 0; i < n; i++) {
        int val = lis[i] + lds[i] - 1;
        if (val > result) result = val;
    }

    return result;
}

int main() {
    int arr[] = {1, 3, 4, 2, 6, 1};
    int n = sizeof(arr) / sizeof(arr[0]);
    printf("%d\n", longest_bitonic_subsequence(arr, n)); // 5
    return 0;
}
