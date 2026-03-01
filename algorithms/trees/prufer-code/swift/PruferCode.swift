func pruferEncode(_ n: Int, _ edges: [[Int]]) -> [Int] {
    if n <= 2 { return [] }

    var adjacency = Array(repeating: [Int](), count: n)
    var degree = Array(repeating: 0, count: n)

    for edge in edges where edge.count >= 2 {
        let u = edge[0]
        let v = edge[1]
        adjacency[u].append(v)
        adjacency[v].append(u)
        degree[u] += 1
        degree[v] += 1
    }

    var code: [Int] = []
    for _ in 0..<(n - 2) {
        var leaf = 0
        while leaf < n && degree[leaf] != 1 {
            leaf += 1
        }
        if leaf == n { break }

        let neighbor = adjacency[leaf].first { degree[$0] > 0 } ?? 0
        code.append(neighbor)
        degree[leaf] -= 1
        degree[neighbor] -= 1
    }

    return code
}
