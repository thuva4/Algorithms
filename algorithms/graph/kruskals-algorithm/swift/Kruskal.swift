/// Union-Find data structure for cycle detection.
class UnionFind {
    var parent: [Int]
    var rank: [Int]

    init(_ n: Int) {
        parent = Array(0..<n)
        rank = Array(repeating: 0, count: n)
    }

    func find(_ x: Int) -> Int {
        if parent[x] != x {
            parent[x] = find(parent[x])
        }
        return parent[x]
    }

    func union(_ x: Int, _ y: Int) -> Bool {
        let rootX = find(x)
        let rootY = find(y)

        if rootX == rootY { return false }

        if rank[rootX] < rank[rootY] {
            parent[rootX] = rootY
        } else if rank[rootX] > rank[rootY] {
            parent[rootY] = rootX
        } else {
            parent[rootY] = rootX
            rank[rootX] += 1
        }
        return true
    }
}

/// Kruskal's algorithm to find MST total weight.
func kruskal(numVertices: Int, edges: [[Int]]) -> Int {
    let sortedEdges = edges.sorted { $0[2] < $1[2] }
    let uf = UnionFind(numVertices)
    var totalWeight = 0
    var edgesUsed = 0

    for edge in sortedEdges {
        if edgesUsed >= numVertices - 1 { break }

        if uf.union(edge[0], edge[1]) {
            totalWeight += edge[2]
            edgesUsed += 1
        }
    }

    return totalWeight
}

// Example usage
let edges = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]
let result = kruskal(numVertices: 4, edges: edges)
print("MST total weight: \(result)")
