#include <algorithm>
#include <string>
#include <vector>

int edit_distance(const std::string& first, const std::string& second) {
    const std::size_t rows = first.size() + 1;
    const std::size_t cols = second.size() + 1;
    std::vector<std::vector<int>> dp(rows, std::vector<int>(cols, 0));

    for (std::size_t row = 0; row < rows; ++row) {
        dp[row][0] = static_cast<int>(row);
    }
    for (std::size_t col = 0; col < cols; ++col) {
        dp[0][col] = static_cast<int>(col);
    }

    for (std::size_t row = 1; row < rows; ++row) {
        for (std::size_t col = 1; col < cols; ++col) {
            int replace_cost = dp[row - 1][col - 1] + (first[row - 1] == second[col - 1] ? 0 : 1);
            int insert_cost = dp[row][col - 1] + 1;
            int delete_cost = dp[row - 1][col] + 1;
            dp[row][col] = std::min(replace_cost, std::min(insert_cost, delete_cost));
        }
    }

    return dp.back().back();
}
