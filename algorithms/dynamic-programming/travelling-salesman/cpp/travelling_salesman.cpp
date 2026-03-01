#include <vector>
#include <algorithm>
#include <climits>

int travelling_salesman(std::vector<int> arr) {
    int n = arr[0];
    if (n <= 1) return 0;
    std::vector<std::vector<int>> dist(n, std::vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dist[i][j] = arr[1 + i*n + j];

    int INF = INT_MAX / 2;
    int full = (1 << n) - 1;
    std::vector<std::vector<int>> dp(1 << n, std::vector<int>(n, INF));
    dp[1][0] = 0;

    for (int mask = 1; mask <= full; mask++)
        for (int i = 0; i < n; i++) {
            if (dp[mask][i] >= INF || !(mask & (1 << i))) continue;
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;
                int nm = mask | (1 << j);
                dp[nm][j] = std::min(dp[nm][j], dp[mask][i] + dist[i][j]);
            }
        }

    int result = INF;
    for (int i = 0; i < n; i++)
        result = std::min(result, dp[full][i] + dist[i][0]);
    return result;
}
