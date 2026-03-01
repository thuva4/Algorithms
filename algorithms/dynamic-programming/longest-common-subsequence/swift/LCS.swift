func lcs(_ x: String, _ y: String) -> Int {
    let xArr = Array(x)
    let yArr = Array(y)
    let m = xArr.count
    let n = yArr.count

    var dp = Array(repeating: Array(repeating: 0, count: n + 1), count: m + 1)

    for i in 1...max(m, 1) {
        guard m > 0 else { break }
        for j in 1...max(n, 1) {
            guard n > 0 else { break }
            if xArr[i - 1] == yArr[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
            }
        }
    }

    return dp[m][n]
}

print(lcs("ABCBDAB", "BDCAB")) // 4
