#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int left, int right) {
    int pivot = arr[right];
    int store_index = left;

    for (int i = left; i < right; i++) {
        if (arr[i] < pivot) {
            swap(&arr[store_index], &arr[i]);
            store_index++;
        }
    }
    swap(&arr[store_index], &arr[right]);
    return store_index;
}

int quick_select(int arr[], int n, int k) {
    int left = 0;
    int right = n - 1;
    int target = k - 1;

    while (left <= right) {
        int pivot_index = partition(arr, left, right);
        if (pivot_index == target) {
            return arr[pivot_index];
        } else if (pivot_index < target) {
            left = pivot_index + 1;
        } else {
            right = pivot_index - 1;
        }
    }

    return -1;
}

int main() {
    int arr[] = {3, 1, 4, 1, 5};
    int n = 5;
    int k = 3;
    int result = quick_select(arr, n, k);
    printf("The %dth smallest element is %d\n", k, result);
    return 0;
}
