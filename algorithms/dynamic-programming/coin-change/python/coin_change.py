def coin_change(coins, amount):
    if amount == 0:
        return 0

    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1

    return dp[amount] if dp[amount] != float('inf') else -1


if __name__ == "__main__":
    coins = [1, 5, 10, 25]
    print(coin_change(coins, 30))  # 2
