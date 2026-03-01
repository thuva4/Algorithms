func rodCut(_ prices: [Int], _ n: Int) -> Int {
    var dp = Array(repeating: 0, count: n + 1)

    if n > 0 {
        for i in 1...n {
            for j in 0..<i {
                dp[i] = max(dp[i], prices[j] + dp[i - j - 1])
            }
        }
    }

    return dp[n]
}

print(rodCut([1, 5, 8, 9, 10, 17, 17, 20], 8)) // 22
