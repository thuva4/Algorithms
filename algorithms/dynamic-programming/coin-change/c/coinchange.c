#include <stdio.h>
#include <limits.h>

int coin_change(int coins[], int num_coins, int amount) {
    if (amount == 0) return 0;

    int dp[amount + 1];
    dp[0] = 0;

    for (int i = 1; i <= amount; i++)
        dp[i] = INT_MAX;

    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < num_coins; j++) {
            if (coins[j] <= i && dp[i - coins[j]] != INT_MAX) {
                int val = dp[i - coins[j]] + 1;
                if (val < dp[i])
                    dp[i] = val;
            }
        }
    }

    return dp[amount] == INT_MAX ? -1 : dp[amount];
}

int main() {
    int coins[] = {1, 5, 10, 25};
    int n = sizeof(coins) / sizeof(coins[0]);
    printf("%d\n", coin_change(coins, n, 30)); // 2
    return 0;
}
