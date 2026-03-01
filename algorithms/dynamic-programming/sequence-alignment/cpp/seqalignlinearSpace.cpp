#include <algorithm>
#include <string>
#include <vector>

int sequence_alignment(const std::string& first, const std::string& second) {
    constexpr int insertion_cost = 4;
    constexpr int deletion_cost = 4;
    constexpr int replacement_cost = 3;

    const std::size_t rows = first.size() + 1;
    const std::size_t cols = second.size() + 1;
    std::vector<std::vector<int>> dp(rows, std::vector<int>(cols, 0));

    for (std::size_t row = 1; row < rows; ++row) {
        dp[row][0] = static_cast<int>(row) * deletion_cost;
    }
    for (std::size_t col = 1; col < cols; ++col) {
        dp[0][col] = static_cast<int>(col) * insertion_cost;
    }

    for (std::size_t row = 1; row < rows; ++row) {
        for (std::size_t col = 1; col < cols; ++col) {
            int substitute = dp[row - 1][col - 1] + (first[row - 1] == second[col - 1] ? 0 : replacement_cost);
            int remove = dp[row - 1][col] + deletion_cost;
            int insert = dp[row][col - 1] + insertion_cost;
            dp[row][col] = std::min(substitute, std::min(remove, insert));
        }
    }

    return dp.back().back();
}
