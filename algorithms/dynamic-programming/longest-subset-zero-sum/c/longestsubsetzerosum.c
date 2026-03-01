#include <stdio.h>

int longest_subset_zero_sum(int arr[], int n) {
    int max_len = 0;

    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += arr[j];
            if (sum == 0) {
                int len = j - i + 1;
                if (len > max_len)
                    max_len = len;
            }
        }
    }

    return max_len;
}

int main() {
    int arr[] = {1, 2, -3, 3};
    int n = sizeof(arr) / sizeof(arr[0]);
    printf("%d\n", longest_subset_zero_sum(arr, n)); // 3
    return 0;
}
