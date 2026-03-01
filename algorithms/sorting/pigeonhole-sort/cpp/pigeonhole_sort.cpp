#include <vector>
#include <algorithm>

/**
 * Pigeonhole Sort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 * @param arr the input vector
 * @returns a sorted copy of the vector
 */
std::vector<int> pigeonhole_sort(const std::vector<int>& arr) {
    if (arr.empty()) {
        return {};
    }

    int min_val = *std::min_element(arr.begin(), arr.end());
    int max_val = *std::max_element(arr.begin(), arr.end());
    int range = max_val - min_val + 1;

    std::vector<std::vector<int>> holes(range);

    for (int x : arr) {
        holes[x - min_val].push_back(x);
    }

    std::vector<int> result;
    result.reserve(arr.size());
    for (const auto& hole : holes) {
        for (int x : hole) {
            result.push_back(x);
        }
    }

    return result;
}
