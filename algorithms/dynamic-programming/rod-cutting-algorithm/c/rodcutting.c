#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int rod_cut(int prices[], int n) {
    int dp[n + 1];
    dp[0] = 0;

    for (int i = 1; i <= n; i++) {
        dp[i] = -1;
        for (int j = 0; j < i; j++) {
            dp[i] = max(dp[i], prices[j] + dp[i - j - 1]);
        }
    }

    return dp[n];
}

int main() {
    int prices[] = {1, 5, 8, 9, 10, 17, 17, 20};
    int n = 8;
    printf("%d\n", rod_cut(prices, n)); // 22
    return 0;
}
