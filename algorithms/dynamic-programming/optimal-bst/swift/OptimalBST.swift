func optimalBst(_ arr: [Int]) -> Int {
    let n = arr[0]
    if n == 0 { return 0 }
    let freq = Array(arr[1...n])

    var cost = Array(repeating: Array(repeating: 0, count: n), count: n)
    for i in 0..<n { cost[i][i] = freq[i] }

    if n >= 2 {
        for len in 2...n {
            for i in 0...(n - len) {
                let j = i + len - 1
                cost[i][j] = Int.max
                var freqSum = 0
                for k in i...j { freqSum += freq[k] }

                for r in i...j {
                    let left = r > i ? cost[i][r - 1] : 0
                    let right = r < j ? cost[r + 1][j] : 0
                    let c = left + right + freqSum
                    if c < cost[i][j] { cost[i][j] = c }
                }
            }
        }
    }

    return cost[0][n - 1]
}
