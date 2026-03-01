#include "bubble_sort.h"
#include <stdbool.h>

/**
 * Bubble Sort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 */
void bubble_sort(int arr[], int n) {
    if (n <= 1) {
        return;
    }

    for (int i = 0; i < n - 1; i++) {
        // Optimization: track if any swaps occurred in this pass
        bool swapped = false;

        // Last i elements are already in place, so we don't need to check them
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements if they are in the wrong order
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }

        // If no two elements were swapped by inner loop, then break
        if (!swapped) {
            break;
        }
    }
}
