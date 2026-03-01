/// Determine if target can be formed by summing elements from arr
/// with repetition allowed.
///
/// - Parameter arr: array of positive integers (available elements)
/// - Parameter target: the target sum to reach
/// - Returns: 1 if target is achievable, 0 otherwise
func canSum(_ arr: [Int], _ target: Int) -> Int {
    if target == 0 { return 1 }

    var dp = Array(repeating: false, count: target + 1)
    dp[0] = true

    for i in 1...target {
        for elem in arr {
            if elem <= i && dp[i - elem] {
                dp[i] = true
                break
            }
        }
    }

    return dp[target] ? 1 : 0
}

print(canSum([2, 3], 7))   // 1
print(canSum([5, 3], 8))   // 1
print(canSum([2, 4], 7))   // 0
print(canSum([1], 5))      // 1
print(canSum([7], 3))      // 0
