#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Find the length of the longest contiguous subarray common to both arrays.
 *
 * arr1: first vector of integers
 * arr2: second vector of integers
 * Returns: length of the longest common contiguous subarray
 */
int longestCommonSubstring(const vector<int>& arr1, const vector<int>& arr2) {
    int n = arr1.size();
    int m = arr2.size();
    int maxLen = 0;

    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (arr1[i - 1] == arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > maxLen) {
                    maxLen = dp[i][j];
                }
            } else {
                dp[i][j] = 0;
            }
        }
    }

    return maxLen;
}

int main() {
    cout << longestCommonSubstring({1, 2, 3, 4, 5}, {3, 4, 5, 6, 7}) << endl;  // 3
    cout << longestCommonSubstring({1, 2, 3}, {4, 5, 6}) << endl;                // 0
    cout << longestCommonSubstring({1, 2, 3, 4}, {1, 2, 3, 4}) << endl;          // 4
    cout << longestCommonSubstring({1}, {1}) << endl;                             // 1
    cout << longestCommonSubstring({1, 2, 3, 2, 1}, {3, 2, 1, 4, 7}) << endl;   // 3
    return 0;
}
