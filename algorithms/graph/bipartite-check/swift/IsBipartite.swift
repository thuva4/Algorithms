func isBipartite(_ arr: [Int]) -> Int {
    let n = arr[0]
    let m = arr[1]
    var adj = [[Int]](repeating: [], count: n)
    for i in 0..<m {
        let u = arr[2 + 2 * i]
        let v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        adj[v].append(u)
    }

    var color = [Int](repeating: -1, count: n)

    for start in 0..<n {
        if color[start] != -1 { continue }
        color[start] = 0
        var queue = [Int]()
        queue.append(start)
        var front = 0
        while front < queue.count {
            let u = queue[front]
            front += 1
            for v in adj[u] {
                if color[v] == -1 {
                    color[v] = 1 - color[u]
                    queue.append(v)
                } else if color[v] == color[u] {
                    return 0
                }
            }
        }
    }

    return 1
}
