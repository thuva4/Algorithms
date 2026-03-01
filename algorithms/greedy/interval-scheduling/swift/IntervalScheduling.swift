func intervalScheduling(_ arr: [Int]) -> Int {
    let n = arr[0]
    var intervals: [(start: Int, end: Int)] = []
    for i in 0..<n {
        intervals.append((arr[1 + 2 * i], arr[1 + 2 * i + 1]))
    }

    intervals.sort { $0.end < $1.end }

    var count = 0
    var lastEnd = -1
    for iv in intervals {
        if iv.start >= lastEnd {
            count += 1
            lastEnd = iv.end
        }
    }

    return count
}
