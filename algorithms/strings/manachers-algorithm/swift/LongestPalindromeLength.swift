func longestPalindromeLength(_ arr: [Int]) -> Int {
    if arr.isEmpty { return 0 }

    var t = [-1]
    for x in arr {
        t.append(x)
        t.append(-1)
    }

    let n = t.count
    var p = [Int](repeating: 0, count: n)
    var c = 0, r = 0, maxLen = 0

    for i in 0..<n {
        let mirror = 2 * c - i
        if i < r && mirror >= 0 {
            p[i] = min(r - i, p[mirror])
        }
        while i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] == t[i - p[i] - 1] {
            p[i] += 1
        }
        if i + p[i] > r { c = i; r = i + p[i] }
        if p[i] > maxLen { maxLen = p[i] }
    }

    return maxLen
}
