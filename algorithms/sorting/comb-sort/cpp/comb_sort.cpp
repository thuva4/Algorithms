#include <vector>
#include <algorithm>
#include <cmath>

/**
 * Comb Sort implementation.
 * Improves on Bubble Sort by using a gap larger than 1.
 * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
 * @param arr the input vector
 * @returns a sorted copy of the vector
 */
std::vector<int> comb_sort(std::vector<int> arr) {
    int n = static_cast<int>(arr.size());
    int gap = n;
    bool sorted = false;
    const double shrink = 1.3;

    while (!sorted) {
        gap = static_cast<int>(std::floor(gap / shrink));
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }

        for (int i = 0; i < n - gap; ++i) {
            if (arr[i] > arr[i + gap]) {
                std::swap(arr[i], arr[i + gap]);
                sorted = false;
            }
        }
    }

    return arr;
}
