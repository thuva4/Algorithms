#include "cocktail_sort.h"
#include <stdbool.h>

/**
 * Cocktail Sort (Bidirectional Bubble Sort) implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 */
void cocktail_sort(int arr[], int n) {
    if (n <= 1) {
        return;
    }

    int start = 0;
    int end = n - 1;
    bool swapped = true;

    while (swapped) {
        swapped = false;

        // Forward pass
        for (int i = start; i < end; ++i) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }

        swapped = false;
        --end;

        // Backward pass
        for (int i = end - 1; i >= start; --i) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }

        ++start;
    }
}
