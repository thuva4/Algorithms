#include <vector>
#include <algorithm>

int longest_palindromic_subsequence(std::vector<int> arr) {
    int n = static_cast<int>(arr.size());
    if (n == 0) return 0;
    std::vector<std::vector<int>> dp(n, std::vector<int>(n, 0));
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (arr[i] == arr[j]) dp[i][j] = (len == 2) ? 2 : dp[i + 1][j - 1] + 2;
            else dp[i][j] = std::max(dp[i + 1][j], dp[i][j - 1]);
        }
    }
    return dp[0][n - 1];
}
