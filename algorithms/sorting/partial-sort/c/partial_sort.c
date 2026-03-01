#include "partial_sort.h"
#include <stdlib.h>
#include <string.h>

static int compare(const void *a, const void *b) {
    return (*(int *)a - *(int *)b);
}

void partial_sort(const int arr[], int n, int k, int result[]) {
    if (k <= 0) return;
    if (k > n) k = n;

    // For C, a simple approach is to copy and qsort
    // More efficient partial sorts exist (e.g. heap-based), but qsort is standard
    int *temp = (int *)malloc(n * sizeof(int));
    if (!temp) return;

    memcpy(temp, arr, n * sizeof(int));
    qsort(temp, n, sizeof(int), compare);

    memcpy(result, temp, k * sizeof(int));
    free(temp);
}
