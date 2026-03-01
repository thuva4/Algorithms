#include "bogo_sort.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <time.h>

/**
 * Bogo Sort implementation.
 * Repeatedly shuffles the array until it's sorted.
 * WARNING: Highly inefficient for large arrays.
 */

bool is_sorted(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

void shuffle(int *arr, int n) {
    for (int i = n - 1; i > 0; i--) {
        int j = rand() % (i + 1);
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

void bogo_sort(int *arr, int n) {
    if (n <= 1) return;

    srand(time(NULL));

    while (!is_sorted(arr, n)) {
        shuffle(arr, n);
    }
}
