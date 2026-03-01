def rod_cut(prices, n):
    dp = [0] * (n + 1)

    for i in range(1, n + 1):
        for j in range(i):
            dp[i] = max(dp[i], prices[j] + dp[i - j - 1])

    return dp[n]


if __name__ == "__main__":
    prices = [1, 5, 8, 9, 10, 17, 17, 20]
    print(rod_cut(prices, 8))  # 22
