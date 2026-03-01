func convexHullCount(_ arr: [Int]) -> Int {
    let n = arr[0]
    if n <= 2 { return n }

    var points: [(Int, Int)] = []
    var idx = 1
    for _ in 0..<n { points.append((arr[idx], arr[idx + 1])); idx += 2 }
    points.sort { $0.0 != $1.0 ? $0.0 < $1.0 : $0.1 < $1.1 }

    func cross(_ o: (Int, Int), _ a: (Int, Int), _ b: (Int, Int)) -> Int {
        return (a.0 - o.0) * (b.1 - o.1) - (a.1 - o.1) * (b.0 - o.0)
    }

    var hull: [(Int, Int)] = []
    for p in points {
        while hull.count >= 2 && cross(hull[hull.count - 2], hull[hull.count - 1], p) <= 0 { hull.removeLast() }
        hull.append(p)
    }
    let lower = hull.count + 1
    for i in stride(from: n - 2, through: 0, by: -1) {
        while hull.count >= lower && cross(hull[hull.count - 2], hull[hull.count - 1], points[i]) <= 0 { hull.removeLast() }
        hull.append(points[i])
    }
    return hull.count - 1
}
