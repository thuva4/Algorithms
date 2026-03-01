#include <algorithm>
#include <climits>
#include <numeric>
#include <vector>

std::vector<int> hungarian(const std::vector<std::vector<int>>& cost_matrix) {
    int n = static_cast<int>(cost_matrix.size());
    std::vector<int> columns(n);
    std::iota(columns.begin(), columns.end(), 0);

    std::vector<int> best_assignment = columns;
    int best_cost = INT_MAX;
    do {
        int cost = 0;
        for (int row = 0; row < n; ++row) {
            cost += cost_matrix[row][columns[row]];
        }
        if (cost < best_cost) {
            best_cost = cost;
            best_assignment = columns;
        }
    } while (std::next_permutation(columns.begin(), columns.end()));

    best_assignment.push_back(best_cost);
    return best_assignment;
}
