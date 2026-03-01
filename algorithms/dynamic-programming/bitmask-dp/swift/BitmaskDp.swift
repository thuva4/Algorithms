import Foundation

func popcount(_ x: Int) -> Int {
    var count = 0
    var v = x
    while v > 0 { count += v & 1; v >>= 1 }
    return count
}

func bitmaskDp(_ n: Int, _ cost: [[Int]]) -> Int {
    let total = 1 << n
    var dp = [Int](repeating: Int.max, count: total)
    dp[0] = 0

    for mask in 0..<total {
        if dp[mask] == Int.max { continue }
        let worker = popcount(mask)
        if worker >= n { continue }
        for job in 0..<n {
            if mask & (1 << job) == 0 {
                let newMask = mask | (1 << job)
                let newCost = dp[mask] + cost[worker][job]
                if newCost < dp[newMask] { dp[newMask] = newCost }
            }
        }
    }

    return dp[total - 1]
}

let n = Int(readLine()!)!
var cost = [[Int]]()
for _ in 0..<n {
    cost.append(readLine()!.split(separator: " ").map { Int($0)! })
}
print(bitmaskDp(n, cost))
