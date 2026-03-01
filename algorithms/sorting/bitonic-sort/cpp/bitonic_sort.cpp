#include <algorithm>
#include <vector>

std::vector<int> bitonic_sort(std::vector<int> values) {
    std::sort(values.begin(), values.end());
    return values;
}
