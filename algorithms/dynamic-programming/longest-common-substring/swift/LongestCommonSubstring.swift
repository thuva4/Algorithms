/// Find the length of the longest contiguous subarray common to both arrays.
///
/// - Parameter arr1: first array of integers
/// - Parameter arr2: second array of integers
/// - Returns: length of the longest common contiguous subarray
func longestCommonSubstring(_ arr1: [Int], _ arr2: [Int]) -> Int {
    let n = arr1.count
    let m = arr2.count
    var maxLen = 0

    var dp = Array(repeating: Array(repeating: 0, count: m + 1), count: n + 1)

    for i in 1...n {
        for j in 1...m {
            if arr1[i - 1] == arr2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > maxLen {
                    maxLen = dp[i][j]
                }
            } else {
                dp[i][j] = 0
            }
        }
    }

    return maxLen
}

print(longestCommonSubstring([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]))  // 3
print(longestCommonSubstring([1, 2, 3], [4, 5, 6]))                // 0
print(longestCommonSubstring([1, 2, 3, 4], [1, 2, 3, 4]))          // 4
print(longestCommonSubstring([1], [1]))                             // 1
print(longestCommonSubstring([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]))   // 3
