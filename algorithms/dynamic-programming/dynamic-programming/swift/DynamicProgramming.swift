func max1dRangeSum(_ arr: [Int]) -> Int {
    var best = 0
    var current = 0

    for value in arr {
        current = max(0, current + value)
        best = max(best, current)
    }

    return best
}
