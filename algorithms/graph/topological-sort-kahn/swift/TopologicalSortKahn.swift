func topologicalSortKahn(_ arr: [Int]) -> [Int] {
    if arr.count < 2 {
        return []
    }

    let numVertices = arr[0]
    let numEdges = arr[1]

    var adj = [[Int]](repeating: [], count: numVertices)
    var inDegree = [Int](repeating: 0, count: numVertices)

    for i in 0..<numEdges {
        let u = arr[2 + 2 * i]
        let v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        inDegree[v] += 1
    }

    var queue: [Int] = []
    for v in 0..<numVertices {
        if inDegree[v] == 0 {
            queue.append(v)
        }
    }

    var result: [Int] = []
    var front = 0
    while front < queue.count {
        let u = queue[front]
        front += 1
        result.append(u)
        for v in adj[u] {
            inDegree[v] -= 1
            if inDegree[v] == 0 {
                queue.append(v)
            }
        }
    }

    if result.count == numVertices {
        return result
    }
    return []
}
