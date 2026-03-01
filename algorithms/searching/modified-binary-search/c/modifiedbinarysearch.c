#include <stdio.h>

int modified_binary_search(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;
    int result = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            result = mid;
            high = mid - 1;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return result;
}

int main() {
    int arr[] = {1, 3, 5, 7, 9, 11};
    int n = 6;
    int target = 7;
    int result = modified_binary_search(arr, n, target);
    printf("Index of %d is %d\n", target, result);
    return 0;
}
