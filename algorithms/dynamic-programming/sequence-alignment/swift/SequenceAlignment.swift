let gapCost = 4
let mismatchCost = 3

func sequenceAlignment(_ s1: String, _ s2: String) -> Int {
    let arr1 = Array(s1)
    let arr2 = Array(s2)
    let m = arr1.count
    let n = arr2.count

    var dp = Array(repeating: Array(repeating: 0, count: n + 1), count: m + 1)

    for i in 0...m { dp[i][0] = i * gapCost }
    for j in 0...n { dp[0][j] = j * gapCost }

    for i in 1...max(m, 1) {
        guard m > 0 else { break }
        for j in 1...max(n, 1) {
            guard n > 0 else { break }
            let matchCost = arr1[i - 1] == arr2[j - 1] ? 0 : mismatchCost
            dp[i][j] = min(
                min(dp[i - 1][j] + gapCost, dp[i][j - 1] + gapCost),
                dp[i - 1][j - 1] + matchCost
            )
        }
    }

    return dp[m][n]
}

print(sequenceAlignment("GCCCTAGCG", "GCGCAATG")) // 18
