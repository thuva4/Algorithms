/// Hungarian Algorithm - Solve the assignment problem in O(n^3).
///
/// - Parameter cost: n x n cost matrix
/// - Returns: (assignment, totalCost) where assignment[i] is job for worker i
func hungarian(_ cost: [[Int]]) -> ([Int], Int) {
    let n = cost.count
    let INF = Int.max / 2

    var u = [Int](repeating: 0, count: n + 1)
    var v = [Int](repeating: 0, count: n + 1)
    var matchJob = [Int](repeating: 0, count: n + 1)

    for i in 1...n {
        matchJob[0] = i
        var j0 = 0
        var dist = [Int](repeating: INF, count: n + 1)
        var used = [Bool](repeating: false, count: n + 1)
        var prevJob = [Int](repeating: 0, count: n + 1)

        while true {
            used[j0] = true
            let w = matchJob[j0]
            var delta = INF
            var j1 = -1

            for j in 1...n {
                if !used[j] {
                    let cur = cost[w - 1][j - 1] - u[w] - v[j]
                    if cur < dist[j] {
                        dist[j] = cur
                        prevJob[j] = j0
                    }
                    if dist[j] < delta {
                        delta = dist[j]
                        j1 = j
                    }
                }
            }

            for j in 0...n {
                if used[j] {
                    u[matchJob[j]] += delta
                    v[j] -= delta
                } else {
                    dist[j] -= delta
                }
            }

            j0 = j1
            if matchJob[j0] == 0 { break }
        }

        while j0 != 0 {
            matchJob[j0] = matchJob[prevJob[j0]]
            j0 = prevJob[j0]
        }
    }

    var assignment = [Int](repeating: 0, count: n)
    for j in 1...n {
        assignment[matchJob[j] - 1] = j - 1
    }

    let totalCost = (0..<n).reduce(0) { $0 + cost[$1][assignment[$1]] }
    return (assignment, totalCost)
}

// Main
let cost = [[9, 2, 7], [6, 4, 3], [5, 8, 1]]
let (assignment, totalCost) = hungarian(cost)
print("Assignment: \(assignment)")
print("Total cost: \(totalCost)")
