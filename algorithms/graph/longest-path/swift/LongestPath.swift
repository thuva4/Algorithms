/// Longest path in a DAG using topological sort.
func longestPath(adjList: [Int: [[Int]]], startNode: Int) -> [Int: Double] {
    let numNodes = adjList.count
    var visited = Set<Int>()
    var topoOrder = [Int]()

    func dfs(_ node: Int) {
        visited.insert(node)
        if let neighbors = adjList[node] {
            for edge in neighbors {
                if !visited.contains(edge[0]) {
                    dfs(edge[0])
                }
            }
        }
        topoOrder.append(node)
    }

    for i in 0..<numNodes {
        if !visited.contains(i) {
            dfs(i)
        }
    }

    var dist = [Double](repeating: -Double.infinity, count: numNodes)
    dist[startNode] = 0

    for i in stride(from: topoOrder.count - 1, through: 0, by: -1) {
        let u = topoOrder[i]
        if dist[u] != -Double.infinity {
            if let neighbors = adjList[u] {
                for edge in neighbors {
                    let v = edge[0]
                    let w = Double(edge[1])
                    if dist[u] + w > dist[v] {
                        dist[v] = dist[u] + w
                    }
                }
            }
        }
    }

    var result = [Int: Double]()
    for i in 0..<numNodes {
        result[i] = dist[i]
    }
    return result
}

// Example usage
let adjList: [Int: [[Int]]] = [
    0: [[1, 3], [2, 6]],
    1: [[3, 4], [2, 4]],
    2: [[3, 2]],
    3: []
]

let result = longestPath(adjList: adjList, startNode: 0)
print("Longest distances: \(result)")
