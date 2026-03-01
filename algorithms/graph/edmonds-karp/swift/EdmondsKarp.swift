/// Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
func edmondsKarp(capacity: [[Int]], source: Int, sink: Int) -> Int {
    if source == sink { return 0 }

    let n = capacity.count
    var residual = capacity
    var totalFlow = 0

    while true {
        // BFS to find augmenting path
        var parent = [Int](repeating: -1, count: n)
        var visited = [Bool](repeating: false, count: n)
        var queue = [source]
        visited[source] = true

        while !queue.isEmpty && !visited[sink] {
            let u = queue.removeFirst()
            for v in 0..<n {
                if !visited[v] && residual[u][v] > 0 {
                    visited[v] = true
                    parent[v] = u
                    queue.append(v)
                }
            }
        }

        if !visited[sink] { break }

        // Find minimum capacity along path
        var pathFlow = Int.max
        var v = sink
        while v != source {
            pathFlow = min(pathFlow, residual[parent[v]][v])
            v = parent[v]
        }

        // Update residual capacities
        v = sink
        while v != source {
            residual[parent[v]][v] -= pathFlow
            residual[v][parent[v]] += pathFlow
            v = parent[v]
        }

        totalFlow += pathFlow
    }

    return totalFlow
}

// Example usage
let capacity = [
    [0, 10, 10, 0, 0, 0],
    [0, 0, 2, 4, 8, 0],
    [0, 0, 0, 0, 9, 0],
    [0, 0, 0, 0, 0, 10],
    [0, 0, 0, 6, 0, 10],
    [0, 0, 0, 0, 0, 0]
]

let result = edmondsKarp(capacity: capacity, source: 0, sink: 5)
print("Maximum flow: \(result)")
