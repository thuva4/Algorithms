#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int bitmaskDp(int n, vector<vector<int>>& cost) {
    int total = 1 << n;
    vector<int> dp(total, INT_MAX);
    dp[0] = 0;

    for (int mask = 0; mask < total; mask++) {
        if (dp[mask] == INT_MAX) continue;
        int worker = __builtin_popcount(mask);
        if (worker >= n) continue;
        for (int job = 0; job < n; job++) {
            if (!(mask & (1 << job))) {
                int newMask = mask | (1 << job);
                dp[newMask] = min(dp[newMask], dp[mask] + cost[worker][job]);
            }
        }
    }

    return dp[total - 1];
}

int main() {
    int n;
    cin >> n;
    vector<vector<int>> cost(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> cost[i][j];
    cout << bitmaskDp(n, cost) << endl;
    return 0;
}
