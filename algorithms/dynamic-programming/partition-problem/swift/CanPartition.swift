func canPartition(_ arr: [Int]) -> Int {
    let total = arr.reduce(0, +)
    if total % 2 != 0 { return 0 }
    let target = total / 2
    var dp = [Bool](repeating: false, count: target + 1)
    dp[0] = true
    for num in arr {
        for j in stride(from: target, through: num, by: -1) {
            dp[j] = dp[j] || dp[j - num]
        }
    }
    return dp[target] ? 1 : 0
}
