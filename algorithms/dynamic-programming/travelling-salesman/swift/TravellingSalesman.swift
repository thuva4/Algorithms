func travellingSalesman(_ arr: [Int]) -> Int {
    let n = arr[0]
    if n <= 1 { return 0 }
    var dist = [[Int]](repeating: [Int](repeating: 0, count: n), count: n)
    for i in 0..<n { for j in 0..<n { dist[i][j] = arr[1 + i*n + j] } }
    let INF = Int.max / 2
    let full = (1 << n) - 1
    var dp = [[Int]](repeating: [Int](repeating: INF, count: n), count: 1 << n)
    dp[1][0] = 0
    for mask in 1...full {
        for i in 0..<n {
            if dp[mask][i] >= INF || mask & (1 << i) == 0 { continue }
            for j in 0..<n {
                if mask & (1 << j) != 0 { continue }
                let nm = mask | (1 << j)
                let cost = dp[mask][i] + dist[i][j]
                if cost < dp[nm][j] { dp[nm][j] = cost }
            }
        }
    }
    var result = INF
    for i in 0..<n { result = min(result, dp[full][i] + dist[i][0]) }
    return result
}
