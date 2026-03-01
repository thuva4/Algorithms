func offlineLca(_ n: Int, _ edges: [[Int]], _ queries: [[Int]]) -> [Int] {
    if n <= 0 { return [] }

    var adjacency = Array(repeating: [Int](), count: n)
    for edge in edges where edge.count >= 2 {
        let u = edge[0]
        let v = edge[1]
        adjacency[u].append(v)
        adjacency[v].append(u)
    }

    var parent = Array(repeating: -1, count: n)
    var depth = Array(repeating: 0, count: n)
    var queue = [0]
    parent[0] = 0
    var head = 0

    while head < queue.count {
        let node = queue[head]
        head += 1
        for next in adjacency[node] where parent[next] == -1 {
            parent[next] = node
            depth[next] = depth[node] + 1
            queue.append(next)
        }
    }

    func lca(_ a: Int, _ b: Int) -> Int {
        var x = a
        var y = b
        while depth[x] > depth[y] {
            x = parent[x]
        }
        while depth[y] > depth[x] {
            y = parent[y]
        }
        while x != y {
            x = parent[x]
            y = parent[y]
        }
        return x
    }

    return queries.map { query in
        guard query.count >= 2 else { return 0 }
        return lca(query[0], query[1])
    }
}
