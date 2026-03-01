#include "pancake_sort.h"

static void flip(int arr[], int k) {
    int i = 0;
    while (i < k) {
        int temp = arr[i];
        arr[i] = arr[k];
        arr[k] = temp;
        i++;
        k--;
    }
}

static int find_max(int arr[], int n) {
    int mi = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] > arr[mi]) {
            mi = i;
        }
    }
    return mi;
}

void pancake_sort(int arr[], int n) {
    for (int curr_size = n; curr_size > 1; curr_size--) {
        int mi = find_max(arr, curr_size);

        if (mi != curr_size - 1) {
            flip(arr, mi);
            flip(arr, curr_size - 1);
        }
    }
}
