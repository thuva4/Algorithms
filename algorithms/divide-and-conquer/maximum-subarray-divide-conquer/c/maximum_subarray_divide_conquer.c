#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "maximum_subarray_divide_conquer.h"

static long long max_ll(long long a, long long b) { return a > b ? a : b; }

static long long helper(const int* arr, int lo, int hi) {
    if (lo == hi) return arr[lo];
    int mid = (lo + hi) / 2;

    long long left_sum = LLONG_MIN, s = 0;
    for (int i = mid; i >= lo; i--) { s += arr[i]; if (s > left_sum) left_sum = s; }
    long long right_sum = LLONG_MIN; s = 0;
    for (int i = mid + 1; i <= hi; i++) { s += arr[i]; if (s > right_sum) right_sum = s; }

    long long cross = left_sum + right_sum;
    long long left_max = helper(arr, lo, mid);
    long long right_max = helper(arr, mid + 1, hi);
    return max_ll(max_ll(left_max, right_max), cross);
}

long long max_subarray_dc(const int* arr, int n) {
    return helper(arr, 0, n - 1);
}

int main(void) {
    int n; scanf("%d", &n);
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    printf("%lld\n", max_subarray_dc(arr, n));
    free(arr);
    return 0;
}
