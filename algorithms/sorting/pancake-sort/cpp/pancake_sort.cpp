#include <vector>
#include <algorithm>

void flip(std::vector<int>& arr, int k) {
    int i = 0;
    while (i < k) {
        std::swap(arr[i], arr[k]);
        i++;
        k--;
    }
}

int find_max(const std::vector<int>& arr, int n) {
    int mi = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] > arr[mi]) {
            mi = i;
        }
    }
    return mi;
}

/**
 * Pancake Sort implementation.
 * Sorts the array by repeatedly flipping subarrays.
 * @param arr the input vector
 * @returns a sorted copy of the vector
 */
std::vector<int> pancake_sort(std::vector<int> arr) {
    int n = static_cast<int>(arr.size());

    for (int curr_size = n; curr_size > 1; curr_size--) {
        int mi = find_max(arr, curr_size);

        if (mi != curr_size - 1) {
            flip(arr, mi);
            flip(arr, curr_size - 1);
        }
    }

    return arr;
}
