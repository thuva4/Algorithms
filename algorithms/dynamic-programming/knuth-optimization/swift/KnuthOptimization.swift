import Foundation

func knuthOptimization(_ n: Int, _ freq: [Int]) -> Int {
    if n == 0 { return 0 }
    var dp = Array(repeating: Array(repeating: 0, count: n), count: n)
    var opt = Array(repeating: Array(repeating: 0, count: n), count: n)
    var prefix = Array(repeating: 0, count: n + 1)
    for i in 0..<n { prefix[i + 1] = prefix[i] + freq[i] }

    for i in 0..<n {
        dp[i][i] = freq[i]
        opt[i][i] = i
    }

    if n >= 2 {
        for len in 2...n {
            for i in 0...(n - len) {
                let j = i + len - 1
                dp[i][j] = Int.max
                let costSum = prefix[j + 1] - prefix[i]
                let lo = opt[i][j - 1]
                let hi = (i + 1 <= j) ? opt[i + 1][j] : j
                for k in lo...hi {
                    let left = k > i ? dp[i][k - 1] : 0
                    let right = k < j ? dp[k + 1][j] : 0
                    let val = left + right + costSum
                    if val < dp[i][j] {
                        dp[i][j] = val
                        opt[i][j] = k
                    }
                }
            }
        }
    }
    return dp[0][n - 1]
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
let n = data[0]
var freq = [Int]()
if data.count > 1 {
    freq = Array(data[1...n])
} else {
    let line = readLine()!.split(separator: " ").map { Int($0)! }
    freq = line
}
print(knuthOptimization(n, freq))
