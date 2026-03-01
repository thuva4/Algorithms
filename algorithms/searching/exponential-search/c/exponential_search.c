#include "exponential_search.h"

#define MIN(a,b) (((a)<(b))?(a):(b))

static int binary_search(int arr[], int l, int r, int target) {
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == target)
            return mid;
        if (arr[mid] < target)
            l = mid + 1;
        else
            r = mid - 1;
    }
    return -1;
}

int exponential_search(int arr[], int n, int target) {
    if (n == 0) return -1;
    if (arr[0] == target) return 0;
    
    int i = 1;
    while (i < n && arr[i] <= target)
        i = i * 2;
        
    return binary_search(arr, i / 2, MIN(i, n - 1), target);
}
