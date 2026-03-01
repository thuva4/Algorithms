#include "interval_scheduling.h"
#include <stdlib.h>

static int cmp_end(const void* a, const void* b) {
    int* ia = (int*)a;
    int* ib = (int*)b;
    return ia[1] - ib[1];
}

int interval_scheduling(int* arr, int len) {
    int n = arr[0];
    int* intervals = (int*)malloc(n * 2 * sizeof(int));

    for (int i = 0; i < n; i++) {
        intervals[2*i] = arr[1 + 2*i];
        intervals[2*i + 1] = arr[1 + 2*i + 1];
    }

    qsort(intervals, n, 2 * sizeof(int), cmp_end);

    int count = 0, lastEnd = -1;
    for (int i = 0; i < n; i++) {
        if (intervals[2*i] >= lastEnd) {
            count++;
            lastEnd = intervals[2*i + 1];
        }
    }

    free(intervals);
    return count;
}
