/// Floyd-Warshall algorithm to find shortest paths between all pairs of vertices.
/// Input: distance matrix (2D array).
/// Returns the shortest distance matrix.
func floydWarshall(matrix: [[Double]]) -> [[Double]] {
    let n = matrix.count
    var dist = matrix

    for k in 0..<n {
        for i in 0..<n {
            for j in 0..<n {
                if dist[i][k] != Double.infinity &&
                   dist[k][j] != Double.infinity &&
                   dist[i][k] + dist[k][j] < dist[i][j] {
                    dist[i][j] = dist[i][k] + dist[k][j]
                }
            }
        }
    }

    return dist
}

// Example usage
let inf = Double.infinity
let matrix: [[Double]] = [
    [0, 3, inf, 7],
    [8, 0, 2, inf],
    [5, inf, 0, 1],
    [2, inf, inf, 0]
]

let result = floydWarshall(matrix: matrix)

print("Shortest distance matrix:")
for row in result {
    let formatted = row.map { $0 == inf ? "INF" : String(Int($0)) }
    print(formatted.joined(separator: "\t"))
}
