#include "longest_palindrome_subarray.h"

static int expand(int arr[], int n, int l, int r) {
    while (l >= 0 && r < n && arr[l] == arr[r]) {
        l--;
        r++;
    }
    return r - l - 1;
}

int longest_palindrome_subarray(int arr[], int n) {
    if (n == 0) return 0;

    int max_len = 1;
    for (int i = 0; i < n; i++) {
        int odd = expand(arr, n, i, i);
        int even = expand(arr, n, i, i + 1);
        if (odd > max_len) max_len = odd;
        if (even > max_len) max_len = even;
    }
    return max_len;
}
