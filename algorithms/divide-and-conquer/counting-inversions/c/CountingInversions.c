#include <stdio.h>
#include <stdlib.h>

int merge(int arr[], int temp[], int left, int mid, int right) {
    int i = left, j = mid, k = left;
    int inv_count = 0;

    while (i < mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            inv_count += (mid - i);
        }
    }
    while (i < mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    for (i = left; i <= right; i++) arr[i] = temp[i];

    return inv_count;
}

int mergeSortCount(int arr[], int temp[], int left, int right) {
    int inv_count = 0;
    if (left < right) {
        int mid = (left + right) / 2;
        inv_count += mergeSortCount(arr, temp, left, mid);
        inv_count += mergeSortCount(arr, temp, mid + 1, right);
        inv_count += merge(arr, temp, left, mid + 1, right);
    }
    return inv_count;
}

int countInversions(int arr[], int n) {
    int *temp = (int *)malloc(n * sizeof(int));
    int result = mergeSortCount(arr, temp, 0, n - 1);
    free(temp);
    return result;
}

int main() {
    int arr[] = {2, 4, 1, 3, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    printf("Number of inversions: %d\n", countInversions(arr, n));
    return 0;
}
