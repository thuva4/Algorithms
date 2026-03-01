#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int rod_cut(vector<int>& prices, int n) {
    vector<int> dp(n + 1, 0);

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            dp[i] = max(dp[i], prices[j] + dp[i - j - 1]);
        }
    }

    return dp[n];
}

int main() {
    vector<int> prices = {1, 5, 8, 9, 10, 17, 17, 20};
    int n = 8;
    cout << rod_cut(prices, n) << endl; // 22
    return 0;
}
