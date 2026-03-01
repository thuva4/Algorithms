#include <algorithm>
#include <vector>

std::vector<std::vector<int>> permutations(std::vector<int> values) {
    std::sort(values.begin(), values.end());

    std::vector<std::vector<int>> result;
    if (values.empty()) {
        result.push_back({});
        return result;
    }

    do {
        result.push_back(values);
    } while (std::next_permutation(values.begin(), values.end()));

    return result;
}
