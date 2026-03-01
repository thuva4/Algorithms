func longestBitonicSubsequence(_ arr: [Int]) -> Int {
    let n = arr.count
    if n == 0 { return 0 }

    var lis = Array(repeating: 1, count: n)
    var lds = Array(repeating: 1, count: n)

    for i in 1..<n {
        for j in 0..<i {
            if arr[j] < arr[i] && lis[j] + 1 > lis[i] {
                lis[i] = lis[j] + 1
            }
        }
    }

    for i in stride(from: n - 2, through: 0, by: -1) {
        for j in stride(from: n - 1, through: i + 1, by: -1) {
            if arr[j] < arr[i] && lds[j] + 1 > lds[i] {
                lds[i] = lds[j] + 1
            }
        }
    }

    var result = 0
    for i in 0..<n {
        result = max(result, lis[i] + lds[i] - 1)
    }

    return result
}

print(longestBitonicSubsequence([1, 3, 4, 2, 6, 1])) // 5
