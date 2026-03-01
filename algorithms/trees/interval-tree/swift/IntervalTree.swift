func intervalTree(_ data: [Int]) -> Int {
    let n = data[0]
    let query = data[2 * n + 1]
    var count = 0
    var idx = 1
    for _ in 0..<n {
        let lo = data[idx], hi = data[idx + 1]
        idx += 2
        if lo <= query && query <= hi { count += 1 }
    }
    return count
}

print(intervalTree([3, 1, 5, 3, 8, 6, 10, 4]))
print(intervalTree([2, 1, 3, 5, 7, 10]))
print(intervalTree([3, 1, 10, 2, 9, 3, 8, 5]))
