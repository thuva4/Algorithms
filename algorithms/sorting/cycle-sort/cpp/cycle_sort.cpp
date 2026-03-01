#include <vector>
#include <algorithm>

/**
 * Cycle Sort implementation.
 * An in-place, unstable sorting algorithm that is optimal in terms of
 * the number of writes to the original array.
 * @param arr the input vector
 * @returns a sorted copy of the vector
 */
std::vector<int> cycle_sort(std::vector<int> arr) {
    int n = static_cast<int>(arr.size());

    for (int cycle_start = 0; cycle_start <= n - 2; cycle_start++) {
        int item = arr[cycle_start];

        int pos = cycle_start;
        for (int i = cycle_start + 1; i < n; i++) {
            if (arr[i] < item) {
                pos++;
            }
        }

        if (pos == cycle_start) {
            continue;
        }

        while (item == arr[pos]) {
            pos++;
        }

        if (pos != cycle_start) {
            std::swap(item, arr[pos]);
        }

        while (pos != cycle_start) {
            pos = cycle_start;
            for (int i = cycle_start + 1; i < n; i++) {
                if (arr[i] < item) {
                    pos++;
                }
            }

            while (item == arr[pos]) {
                pos++;
            }

            if (item != arr[pos]) {
                std::swap(item, arr[pos]);
            }
        }
    }

    return arr;
}
