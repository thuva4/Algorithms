func closestPair(_ arr: [Int]) -> Int {
    let n = arr.count / 2
    var points: [(Int, Int)] = (0..<n).map { (arr[2 * $0], arr[2 * $0 + 1]) }
    points.sort { $0.0 != $1.0 ? $0.0 < $1.0 : $0.1 < $1.1 }

    func distSq(_ a: (Int, Int), _ b: (Int, Int)) -> Int {
        return (a.0 - b.0) * (a.0 - b.0) + (a.1 - b.1) * (a.1 - b.1)
    }

    if n < 2 { return 0 }

    var best = Int.max
    for i in 0..<(n - 1) {
        for j in (i + 1)..<n {
            best = min(best, distSq(points[i], points[j]))
        }
    }
    return best
}
