func hamiltonianPath(_ arr: [Int]) -> Int {
    let n = arr[0], m = arr[1]
    if n <= 1 { return 1 }
    var adj = [[Bool]](repeating: [Bool](repeating: false, count: n), count: n)
    for i in 0..<m {
        let u = arr[2+2*i], v = arr[3+2*i]
        adj[u][v] = true; adj[v][u] = true
    }
    let full = (1 << n) - 1
    var dp = [[Bool]](repeating: [Bool](repeating: false, count: n), count: 1 << n)
    for i in 0..<n { dp[1 << i][i] = true }
    for mask in 1...full {
        for i in 0..<n {
            if !dp[mask][i] { continue }
            for j in 0..<n {
                if mask & (1 << j) == 0 && adj[i][j] {
                    dp[mask | (1 << j)][j] = true
                }
            }
        }
    }
    for i in 0..<n { if dp[full][i] { return 1 } }
    return 0
}
