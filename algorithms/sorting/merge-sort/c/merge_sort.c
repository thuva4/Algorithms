#include "merge_sort.h"
#include <stdlib.h>
#include <string.h>

static void merge(int arr[], int left[], int left_size, int right[], int right_size) {
    int i = 0, j = 0, k = 0;

    while (i < left_size && j < right_size) {
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
    }

    while (i < left_size) {
        arr[k++] = left[i++];
    }

    while (j < right_size) {
        arr[k++] = right[j++];
    }
}

void merge_sort(int arr[], int n) {
    if (n <= 1) {
        return;
    }

    int mid = n / 2;
    int *left = (int *)malloc(mid * sizeof(int));
    int *right = (int *)malloc((n - mid) * sizeof(int));

    if (!left || !right) {
        free(left);
        free(right);
        return;
    }

    memcpy(left, arr, mid * sizeof(int));
    memcpy(right, arr + mid, (n - mid) * sizeof(int));

    merge_sort(left, mid);
    merge_sort(right, n - mid);

    merge(arr, left, mid, right, n - mid);

    free(left);
    free(right);
}
