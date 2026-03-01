#include <vector>
#include <algorithm>
#include <climits>

int egg_drop(std::vector<int> arr) {
    int eggs = arr[0], floors = arr[1];
    std::vector<std::vector<int>> dp(eggs + 1, std::vector<int>(floors + 1, 0));
    for (int f = 1; f <= floors; f++) dp[1][f] = f;
    for (int e = 2; e <= eggs; e++) {
        for (int f = 1; f <= floors; f++) {
            dp[e][f] = INT_MAX;
            for (int x = 1; x <= f; x++) {
                int worst = 1 + std::max(dp[e - 1][x - 1], dp[e][f - x]);
                dp[e][f] = std::min(dp[e][f], worst);
            }
        }
    }
    return dp[eggs][floors];
}
