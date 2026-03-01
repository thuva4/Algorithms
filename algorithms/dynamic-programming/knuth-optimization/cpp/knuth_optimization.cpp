#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int knuth_optimization(int n, const vector<int>& freq) {
    vector<vector<int>> dp(n, vector<int>(n, 0));
    vector<vector<int>> opt(n, vector<int>(n, 0));
    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + freq[i];

    for (int i = 0; i < n; i++) {
        dp[i][i] = freq[i];
        opt[i][i] = i;
    }

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            int cost_sum = prefix[j + 1] - prefix[i];
            int lo = opt[i][j - 1];
            int hi = (i + 1 <= j) ? opt[i + 1][j] : j;
            for (int k = lo; k <= hi; k++) {
                int left = (k > i) ? dp[i][k - 1] : 0;
                int right = (k < j) ? dp[k + 1][j] : 0;
                int val = left + right + cost_sum;
                if (val < dp[i][j]) {
                    dp[i][j] = val;
                    opt[i][j] = k;
                }
            }
        }
    }
    return dp[0][n - 1];
}

int main() {
    int n;
    cin >> n;
    vector<int> freq(n);
    for (int i = 0; i < n; i++) cin >> freq[i];
    cout << knuth_optimization(n, freq) << endl;
    return 0;
}
