import Foundation

func voronoiDiagram(_ arr: [Int]) -> Int {
    let n = arr[0]
    if n < 3 { return 0 }

    let px = (0..<n).map { Double(arr[1 + 2 * $0]) }
    let py = (0..<n).map { Double(arr[1 + 2 * $0 + 1]) }

    let eps = 1e-9
    var vertices = Set<String>()

    for i in 0..<n {
        for j in (i+1)..<n {
            for k in (j+1)..<n {
                let (ax, ay) = (px[i], py[i])
                let (bx, by) = (px[j], py[j])
                let (cx, cy) = (px[k], py[k])

                let d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
                if abs(d) < eps { continue }

                let ux = ((ax*ax + ay*ay) * (by - cy) +
                          (bx*bx + by*by) * (cy - ay) +
                          (cx*cx + cy*cy) * (ay - by)) / d
                let uy = ((ax*ax + ay*ay) * (cx - bx) +
                          (bx*bx + by*by) * (ax - cx) +
                          (cx*cx + cy*cy) * (bx - ax)) / d

                let rSq = (ux - ax) * (ux - ax) + (uy - ay) * (uy - ay)

                var valid = true
                for m in 0..<n {
                    if m == i || m == j || m == k { continue }
                    let distSq = (ux - px[m]) * (ux - px[m]) + (uy - py[m]) * (uy - py[m])
                    if distSq < rSq - eps {
                        valid = false
                        break
                    }
                }

                if valid {
                    let rx = Int64((ux * 1000000).rounded())
                    let ry = Int64((uy * 1000000).rounded())
                    vertices.insert("\(rx),\(ry)")
                }
            }
        }
    }

    return vertices.count
}
