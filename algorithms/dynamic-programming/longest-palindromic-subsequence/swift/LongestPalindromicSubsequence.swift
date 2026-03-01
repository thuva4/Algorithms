func longestPalindromicSubsequence(_ arr: [Int]) -> Int {
    let n = arr.count
    if n == 0 { return 0 }
    var dp = Array(repeating: Array(repeating: 0, count: n), count: n)
    for i in 0..<n { dp[i][i] = 1 }
    if n >= 2 {
        for len in 2...n {
            for i in 0...(n - len) {
                let j = i + len - 1
                if arr[i] == arr[j] { dp[i][j] = len == 2 ? 2 : dp[i + 1][j - 1] + 2 }
                else { dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]) }
            }
        }
    }
    return dp[0][n - 1]
}
