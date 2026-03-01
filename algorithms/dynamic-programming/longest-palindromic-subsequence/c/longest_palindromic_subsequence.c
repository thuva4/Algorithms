#include "longest_palindromic_subsequence.h"

int longest_palindromic_subsequence(const int* arr, int n) {
    if (n == 0) return 0;
    int dp[500][500];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dp[i][j] = 0;
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (arr[i] == arr[j]) dp[i][j] = (len == 2) ? 2 : dp[i + 1][j - 1] + 2;
            else dp[i][j] = dp[i + 1][j] > dp[i][j - 1] ? dp[i + 1][j] : dp[i][j - 1];
        }
    }
    return dp[0][n - 1];
}
