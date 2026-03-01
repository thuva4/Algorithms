#include <algorithm>
#include <cstddef>
#include <vector>

int max_1d_range_sum(const std::vector<int>& values) {
    if (values.empty()) {
        return 0;
    }

    int best = values.front();
    int current = values.front();
    for (std::size_t index = 1; index < values.size(); ++index) {
        current = std::max(values[index], current + values[index]);
        best = std::max(best, current);
    }

    return std::max(0, best);
}
