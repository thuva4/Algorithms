#include <algorithm>
#include <limits>
#include <vector>

int coin_change(const std::vector<int>& coins, int amount) {
    if (amount < 0) {
        return -1;
    }

    const int unreachable = std::numeric_limits<int>::max() / 4;
    std::vector<int> dp(static_cast<std::size_t>(amount) + 1, unreachable);
    dp[0] = 0;

    for (int value = 1; value <= amount; ++value) {
        for (int coin : coins) {
            if (coin > 0 && coin <= value && dp[value - coin] != unreachable) {
                dp[value] = std::min(dp[value], dp[value - coin] + 1);
            }
        }
    }

    return dp[amount] == unreachable ? -1 : dp[amount];
}
