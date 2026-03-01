func coinChange(_ coins: [Int], _ amount: Int) -> Int {
    if amount == 0 { return 0 }

    var dp = Array(repeating: Int.max, count: amount + 1)
    dp[0] = 0

    for i in 1...amount {
        for coin in coins {
            if coin <= i && dp[i - coin] != Int.max {
                dp[i] = min(dp[i], dp[i - coin] + 1)
            }
        }
    }

    return dp[amount] == Int.max ? -1 : dp[amount]
}

print(coinChange([1, 5, 10, 25], 30)) // 2
