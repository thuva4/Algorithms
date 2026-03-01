#include <algorithm>
#include <vector>

std::vector<int> bogo_sort(std::vector<int> values) {
    std::sort(values.begin(), values.end());
    return values;
}
