/// Compute the Levenshtein (edit) distance between two sequences.
///
/// Input format: [len1, seq1..., len2, seq2...]
/// - Parameter arr: input array encoding two sequences
/// - Returns: minimum number of single-element edits
func levenshteinDistance(_ arr: [Int]) -> Int {
    var idx = 0
    let len1 = arr[idx]; idx += 1
    let seq1 = Array(arr[idx..<idx + len1]); idx += len1
    let len2 = arr[idx]; idx += 1
    let seq2 = Array(arr[idx..<idx + len2])

    var dp = Array(repeating: Array(repeating: 0, count: len2 + 1), count: len1 + 1)

    for i in 0...len1 { dp[i][0] = i }
    for j in 0...len2 { dp[0][j] = j }

    if len1 > 0 && len2 > 0 {
        for i in 1...len1 {
            for j in 1...len2 {
                if seq1[i - 1] == seq2[j - 1] {
                    dp[i][j] = dp[i - 1][j - 1]
                } else {
                    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
                }
            }
        }
    }

    return dp[len1][len2]
}

print(levenshteinDistance([3, 1, 2, 3, 3, 1, 2, 4])) // 1
print(levenshteinDistance([2, 5, 6, 2, 5, 6]))       // 0
print(levenshteinDistance([2, 1, 2, 2, 3, 4]))       // 2
print(levenshteinDistance([0, 3, 1, 2, 3]))          // 3
