#include <vector>
#include <algorithm>

int fractional_knapsack(std::vector<int> arr) {
    int capacity = arr[0];
    int n = arr[1];
    std::vector<std::pair<int, int>> items;
    int idx = 2;
    for (int i = 0; i < n; i++) {
        items.push_back({arr[idx], arr[idx + 1]});
        idx += 2;
    }

    std::sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
        return (double)a.first / a.second > (double)b.first / b.second;
    });

    double totalValue = 0;
    int remaining = capacity;

    for (const auto& item : items) {
        if (remaining <= 0) break;
        if (item.second <= remaining) {
            totalValue += item.first;
            remaining -= item.second;
        } else {
            totalValue += (double)item.first * remaining / item.second;
            remaining = 0;
        }
    }

    return static_cast<int>(totalValue * 100);
}
