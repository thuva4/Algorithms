func hldPathQuery(_ n: Int, _ edges: [[Int]], _ values: [Int], _ queries: [(String, Int, Int)]) -> [Int] {
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
    var head = 0
    parent[0] = 0

    while head < queue.count {
        let node = queue[head]
        head += 1
        for next in adjacency[node] where parent[next] == -1 {
            parent[next] = node
            depth[next] = depth[node] + 1
            queue.append(next)
        }
    }

    func pathValues(_ start: Int, _ end: Int) -> [Int] {
        var u = start
        var v = end
        var up: [Int] = []
        var down: [Int] = []

        while depth[u] > depth[v] {
            up.append(values[u])
            u = parent[u]
        }
        while depth[v] > depth[u] {
            down.append(values[v])
            v = parent[v]
        }
        while u != v {
            up.append(values[u])
            down.append(values[v])
            u = parent[u]
            v = parent[v]
        }

        up.append(values[u])
        return up + down.reversed()
    }

    return queries.map { query in
        let vals = pathValues(query.1, query.2)
        if query.0 == "max" {
            return vals.max() ?? 0
        }
        return vals.reduce(0, +)
    }
}
