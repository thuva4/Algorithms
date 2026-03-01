#include <vector>
#include <algorithm>

/**
 * Cocktail Sort (Bidirectional Bubble Sort) implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 * @param arr the input vector
 * @returns a sorted copy of the vector
 */
std::vector<int> cocktail_sort(std::vector<int> arr) {
    int n = static_cast<int>(arr.size());
    if (n <= 1) {
        return arr;
    }

    int start = 0;
    int end = n - 1;
    bool swapped = true;

    while (swapped) {
        swapped = false;

        // Forward pass
        for (int i = start; i < end; ++i) {
            if (arr[i] > arr[i + 1]) {
                std::swap(arr[i], arr[i + 1]);
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
                std::swap(arr[i], arr[i + 1]);
                swapped = true;
            }
        }

        ++start;
    }

    return arr;
}
