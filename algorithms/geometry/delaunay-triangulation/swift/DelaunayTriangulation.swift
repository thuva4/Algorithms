import Foundation

func delaunayTriangulation(_ arr: [Int]) -> Int {
    let n = arr[0]
    if n < 3 { return 0 }

    var points: [(Int, Int)] = []
    for i in 0..<n {
        points.append((arr[1 + 2 * i], arr[1 + 2 * i + 1]))
    }
    points.sort { lhs, rhs in
        lhs.0 == rhs.0 ? lhs.1 < rhs.1 : lhs.0 < rhs.0
    }

    func cross(_ a: (Int, Int), _ b: (Int, Int), _ c: (Int, Int)) -> Int {
        (b.0 - a.0) * (c.1 - a.1) - (b.1 - a.1) * (c.0 - a.0)
    }

    var lower: [(Int, Int)] = []
    for point in points {
        while lower.count >= 2 && cross(lower[lower.count - 2], lower[lower.count - 1], point) <= 0 {
            lower.removeLast()
        }
        lower.append(point)
    }

    var upper: [(Int, Int)] = []
    for point in points.reversed() {
        while upper.count >= 2 && cross(upper[upper.count - 2], upper[upper.count - 1], point) <= 0 {
            upper.removeLast()
        }
        upper.append(point)
    }

    let hullVertexCount = max(0, lower.count + upper.count - 2)
    let triangleCount = 2 * n - 2 - hullVertexCount
    return max(0, triangleCount)
}
