/// Johnson's algorithm for all-pairs shortest paths.
func johnson(_ numVertices: Int, _ edges: [[Int]]) -> String {
    let rawResult = johnson(numVertices: numVertices, edges: edges)
    if let text = rawResult as? String {
        return text
    }
    guard let distances = rawResult as? [Int: [Int: Double]] else {
        return String(describing: rawResult)
    }

    return distances.keys.sorted().flatMap { source in
        (distances[source] ?? [:]).keys.sorted().map { target in
            let value = distances[source]?[target] ?? Double.infinity
            if value == Double.infinity {
                return "Infinity"
            }
            if value == value.rounded() {
                return String(Int(value))
            }
            return String(value)
        }
    }.joined(separator: " ")
}

func johnson(numVertices: Int, edges: [[Int]]) -> Any {
    // Add virtual node
    var allEdges = edges
    for i in 0..<numVertices {
        allEdges.append([numVertices, i, 0])
    }

    // Bellman-Ford from virtual node
    var h = [Double](repeating: Double.infinity, count: numVertices + 1)
    h[numVertices] = 0

    for _ in 0..<numVertices {
        for e in allEdges {
            if h[e[0]] != Double.infinity && h[e[0]] + Double(e[2]) < h[e[1]] {
                h[e[1]] = h[e[0]] + Double(e[2])
            }
        }
    }

    for e in allEdges {
        if h[e[0]] != Double.infinity && h[e[0]] + Double(e[2]) < h[e[1]] {
            return "negative_cycle"
        }
    }

    // Reweight edges
    var adjList = [Int: [(Int, Int)]]()
    for i in 0..<numVertices { adjList[i] = [] }
    for e in edges {
        let newWeight = Int(Double(e[2]) + h[e[0]] - h[e[1]])
        adjList[e[0]]!.append((e[1], newWeight))
    }

    // Run Dijkstra from each vertex
    var result = [Int: [Int: Double]]()
    for u in 0..<numVertices {
        let dist = dijkstraHelper(n: numVertices, adjList: adjList, src: u)
        var distances = [Int: Double]()
        for v in 0..<numVertices {
            if dist[v] == Double.infinity {
                distances[v] = Double.infinity
            } else {
                distances[v] = dist[v] - h[u] + h[v]
            }
        }
        result[u] = distances
    }

    return result
}

func dijkstraHelper(n: Int, adjList: [Int: [(Int, Int)]], src: Int) -> [Double] {
    var dist = [Double](repeating: Double.infinity, count: n)
    var visited = [Bool](repeating: false, count: n)
    dist[src] = 0

    for _ in 0..<n {
        var u = -1
        var minDist = Double.infinity
        for i in 0..<n {
            if !visited[i] && dist[i] < minDist {
                minDist = dist[i]
                u = i
            }
        }
        if u == -1 { break }
        visited[u] = true

        for (v, w) in adjList[u] ?? [] {
            if !visited[v] && dist[u] + Double(w) < dist[v] {
                dist[v] = dist[u] + Double(w)
            }
        }
    }
    return dist
}

// Example usage
let edges = [[0,1,1], [1,2,2], [2,3,3], [0,3,10]]
let result = johnson(numVertices: 4, edges: edges)
print("Result: \(result)")
