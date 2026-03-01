func topologicalSortParallel(_ data: [Int]) -> Int {
    let n = data[0]
    let m = data[1]

    var adj = [[Int]](repeating: [], count: n)
    var indegree = [Int](repeating: 0, count: n)

    var idx = 2
    for _ in 0..<m {
        let u = data[idx], v = data[idx + 1]
        adj[u].append(v)
        indegree[v] += 1
        idx += 2
    }

    var queue = [Int]()
    for i in 0..<n {
        if indegree[i] == 0 { queue.append(i) }
    }

    var rounds = 0
    var processed = 0

    while !queue.isEmpty {
        var nextQueue = [Int]()
        for node in queue {
            processed += 1
            for neighbor in adj[node] {
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0 {
                    nextQueue.append(neighbor)
                }
            }
        }
        queue = nextQueue
        rounds += 1
    }

    return processed == n ? rounds : -1
}
