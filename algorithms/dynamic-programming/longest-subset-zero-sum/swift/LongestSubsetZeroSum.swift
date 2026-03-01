func longestSubsetZeroSum(_ arr: [Int]) -> Int {
    var maxLen = 0
    var sumMap: [Int: Int] = [0: -1]
    var sum = 0

    for i in 0..<arr.count {
        sum += arr[i]
        if let idx = sumMap[sum] {
            let length = i - idx
            maxLen = max(maxLen, length)
        } else {
            sumMap[sum] = i
        }
    }

    return maxLen
}

print(longestSubsetZeroSum([1, 2, -3, 3])) // 3
