#include "quick_select.h"
#include <stdlib.h>

static void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

static int partition(int arr[], int l, int r) {
    int x = arr[r], i = l;
    for (int j = l; j <= r - 1; j++) {
        if (arr[j] <= x) {
            swap(&arr[i], &arr[j]);
            i++;
        }
    }
    swap(&arr[i], &arr[r]);
    return i;
}

static int kthSmallest(int arr[], int l, int r, int k) {
    if (k > 0 && k <= r - l + 1) {
        int pos = partition(arr, l, r);
        
        if (pos - l == k - 1)
            return arr[pos];
        if (pos - l > k - 1)
            return kthSmallest(arr, l, pos - 1, k);
            
        return kthSmallest(arr, pos + 1, r, k - pos + l - 1);
    }
    return -1; // Should not happen for valid k
}

int quick_select(int arr[], int n, int k) {
    return kthSmallest(arr, 0, n - 1, k);
}
