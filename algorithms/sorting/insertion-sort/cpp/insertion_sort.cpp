#include <vector>

/**
 * Insertion Sort implementation.
 * Builds the final sorted array (or list) one item at a time.
 * @param arr the input vector
 * @returns a sorted copy of the vector
 */
std::vector<int> insertion_sort(std::vector<int> arr) {
    int n = static_cast<int>(arr.size());

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }

    return arr;
}
