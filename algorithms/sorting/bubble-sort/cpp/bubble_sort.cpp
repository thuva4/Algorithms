#include <vector>
#include <algorithm>

/**
 * Bubble Sort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 * @param arr the input vector
 * @returns a sorted copy of the vector
 */
std::vector<int> bubble_sort(std::vector<int> arr) {
    // We take the vector by value, which creates a copy
    int n = static_cast<int>(arr.size());

    for (int i = 0; i < n - 1; i++) {
        // Optimization: track if any swaps occurred in this pass
        bool swapped = false;

        // Last i elements are already in place, so we don't need to check them
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements if they are in the wrong order
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }

        // If no two elements were swapped by inner loop, then break
        if (!swapped) {
            break;
        }
    }

    return arr;
}
