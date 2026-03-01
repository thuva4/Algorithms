/// Prim's algorithm to find MST total weight.
/// Input: number of vertices, weighted adjacency list where each entry is [neighbor, weight].
func prim(numVertices: Int, adjList: [Int: [[Int]]]) -> Int {
    var inMST = [Bool](repeating: false, count: numVertices)
    var key = [Int](repeating: Int.max, count: numVertices)
    key[0] = 0

    var totalWeight = 0

    for _ in 0..<numVertices {
        // Find minimum key vertex not in MST
        var u = -1
        var minKey = Int.max
        for i in 0..<numVertices {
            if !inMST[i] && key[i] < minKey {
                minKey = key[i]
                u = i
            }
        }

        if u == -1 { break }

        inMST[u] = true
        totalWeight += key[u]

        // Update keys of adjacent vertices
        if let neighbors = adjList[u] {
            for edge in neighbors {
                let v = edge[0]
                let w = edge[1]
                if !inMST[v] && w < key[v] {
                    key[v] = w
                }
            }
        }
    }

    return totalWeight
}

// Example usage
let adjList: [Int: [[Int]]] = [
    0: [[1, 10], [2, 6], [3, 5]],
    1: [[0, 10], [3, 15]],
    2: [[0, 6], [3, 4]],
    3: [[0, 5], [1, 15], [2, 4]]
]

let result = prim(numVertices: 4, adjList: adjList)
print("MST total weight: \(result)")
