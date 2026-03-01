func convexHullJarvis(_ arr: [Int]) -> Int {
    let n = arr[0]
    if n < 2 { return n }

    let px = (0..<n).map { arr[1 + 2 * $0] }
    let py = (0..<n).map { arr[1 + 2 * $0 + 1] }

    func cross(_ o: Int, _ a: Int, _ b: Int) -> Int {
        return (px[a] - px[o]) * (py[b] - py[o]) - (py[a] - py[o]) * (px[b] - px[o])
    }

    func distSq(_ a: Int, _ b: Int) -> Int {
        return (px[a] - px[b]) * (px[a] - px[b]) + (py[a] - py[b]) * (py[a] - py[b])
    }

    var start = 0
    for i in 1..<n {
        if px[i] < px[start] || (px[i] == px[start] && py[i] < py[start]) {
            start = i
        }
    }

    var hullCount = 0
    var current = start
    repeat {
        hullCount += 1
        var candidate = 0
        for i in 1..<n {
            if i == current { continue }
            if candidate == current { candidate = i; continue }
            let c = cross(current, candidate, i)
            if c < 0 { candidate = i }
            else if c == 0 && distSq(current, i) > distSq(current, candidate) {
                candidate = i
            }
        }
        current = candidate
    } while current != start

    return hullCount
}
