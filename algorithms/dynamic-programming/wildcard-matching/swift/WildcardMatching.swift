func wildcardMatching(_ arr: [Int]) -> Int {
    var idx = 0
    let tlen = arr[idx]; idx += 1
    let text = Array(arr[idx..<idx+tlen]); idx += tlen
    let plen = arr[idx]; idx += 1
    let pattern = Array(arr[idx..<idx+plen])

    var dp = Array(repeating: Array(repeating: false, count: plen + 1), count: tlen + 1)
    dp[0][0] = true
    if plen > 0 {
        for j in 1...plen { if pattern[j-1] == 0 { dp[0][j] = dp[0][j-1] } }
    }

    if tlen > 0 && plen > 0 {
        for i in 1...tlen { for j in 1...plen {
            if pattern[j-1] == 0 { dp[i][j] = dp[i-1][j] || dp[i][j-1] }
            else if pattern[j-1] == -1 || pattern[j-1] == text[i-1] { dp[i][j] = dp[i-1][j-1] }
        }}
    }
    return dp[tlen][plen] ? 1 : 0
}

print(wildcardMatching([3, 1, 2, 3, 3, 1, 2, 3]))
print(wildcardMatching([3, 1, 2, 3, 1, 0]))
print(wildcardMatching([3, 1, 2, 3, 3, 1, -1, 3]))
print(wildcardMatching([2, 1, 2, 2, 3, 4]))
print(wildcardMatching([0, 1, 0]))
