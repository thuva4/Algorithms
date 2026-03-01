#include <algorithm>
#include <vector>

int knapsack(const std::vector<int>& weights, const std::vector<int>& values, int capacity) {
    if (capacity <= 0 || weights.empty() || values.empty()) {
        return 0;
    }

    std::vector<int> dp(static_cast<std::size_t>(capacity) + 1, 0);
    int item_count = std::min(weights.size(), values.size());

    for (int item = 0; item < item_count; ++item) {
        int weight = weights[item];
        int value = values[item];
        for (int current = capacity; current >= weight; --current) {
            dp[current] = std::max(dp[current], dp[current - weight] + value);
        }
    }

    return dp[capacity];
}
