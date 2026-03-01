#include "bitonic_sort.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

/**
 * Bitonic Sort implementation.
 * Works on any array size by padding to the nearest power of 2.
 */

void compareAndSwap(int *arr, int i, int j, int ascending) {
    if ((ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j])) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

void bitonicMerge(int *arr, int low, int cnt, int ascending) {
    if (cnt > 1) {
        int k = cnt / 2;
        for (int i = low; i < low + k; i++) {
            compareAndSwap(arr, i, i + k, ascending);
        }
        bitonicMerge(arr, low, k, ascending);
        bitonicMerge(arr, low + k, k, ascending);
    }
}

void bitonicSortRecursive(int *arr, int low, int cnt, int ascending) {
    if (cnt > 1) {
        int k = cnt / 2;
        // Sort first half in ascending order
        bitonicSortRecursive(arr, low, k, 1);
        // Sort second half in descending order
        bitonicSortRecursive(arr, low + k, k, 0);
        // Merge the whole sequence in given order
        bitonicMerge(arr, low, cnt, ascending);
    }
}

/**
 * Main bitonic sort function.
 * Allocates a new array and returns it.
 */
int* bitonic_sort(const int *arr, int n) {
    if (n <= 0) return NULL;

    int nextPow2 = 1;
    while (nextPow2 < n) {
        nextPow2 *= 2;
    }

    // Pad the array to the next power of 2
    int *padded = (int *)malloc(nextPow2 * sizeof(int));
    if (!padded) return NULL;

    for (int i = 0; i < n; i++) {
        padded[i] = arr[i];
    }
    for (int i = n; i < nextPow2; i++) {
        padded[i] = INT_MAX;
    }

    bitonicSortRecursive(padded, 0, nextPow2, 1);

    // Copy back to a result array of original size
    int *result = (int *)malloc(n * sizeof(int));
    if (!result) {
        free(padded);
        return NULL;
    }
    memcpy(result, padded, n * sizeof(int));

    free(padded);
    return result;
}
