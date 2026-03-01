func lis(_ arr: [Int]) -> Int {
    let n = arr.count
    if n == 0 { return 0 }

    var dp = Array(repeating: 1, count: n)
    var maxLen = 1

    for i in 1..<n {
        for j in 0..<i {
            if arr[j] < arr[i] && dp[j] + 1 > dp[i] {
                dp[i] = dp[j] + 1
            }
        }
        if dp[i] > maxLen {
            maxLen = dp[i]
        }
    }

    return maxLen
}

print(lis([10, 9, 2, 5, 3, 7, 101, 18])) // 4
