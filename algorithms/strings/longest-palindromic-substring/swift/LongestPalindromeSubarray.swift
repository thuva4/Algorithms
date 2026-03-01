func longestPalindromeSubarray(_ arr: [Int]) -> Int {
    let n = arr.count
    if n == 0 { return 0 }

    func expand(_ l: Int, _ r: Int) -> Int {
        var left = l, right = r
        while left >= 0 && right < n && arr[left] == arr[right] {
            left -= 1
            right += 1
        }
        return right - left - 1
    }

    var maxLen = 1
    for i in 0..<n {
        let odd = expand(i, i)
        let even = expand(i, i + 1)
        maxLen = max(maxLen, max(odd, even))
    }
    return maxLen
}
