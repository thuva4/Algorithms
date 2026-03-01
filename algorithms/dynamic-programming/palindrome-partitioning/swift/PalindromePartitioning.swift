func palindromePartitioning(_ arr: [Int]) -> Int {
    let n = arr.count
    if n <= 1 { return 0 }

    var isPal = Array(repeating: Array(repeating: false, count: n), count: n)
    for i in 0..<n { isPal[i][i] = true }
    for i in 0..<n-1 { isPal[i][i+1] = arr[i] == arr[i+1] }
    for len in 3...n {
        for i in 0...n-len {
            let j = i + len - 1
            isPal[i][j] = arr[i] == arr[j] && isPal[i+1][j-1]
        }
    }

    var cuts = Array(repeating: 0, count: n)
    for i in 0..<n {
        if isPal[0][i] { cuts[i] = 0; continue }
        cuts[i] = i
        for j in 1...i {
            if isPal[j][i] && cuts[j-1] + 1 < cuts[i] { cuts[i] = cuts[j-1] + 1 }
        }
    }
    return cuts[n-1]
}

print(palindromePartitioning([1, 2, 1]))
print(palindromePartitioning([1, 2, 3, 2]))
print(palindromePartitioning([1, 2, 3]))
print(palindromePartitioning([5]))
