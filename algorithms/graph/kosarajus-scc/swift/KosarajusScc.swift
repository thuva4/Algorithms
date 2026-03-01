func kosarajusScc(_ arr: [Int]) -> Int {
    let n = arr[0]
    let m = arr[1]
    var adj = [[Int]](repeating: [], count: n)
    var radj = [[Int]](repeating: [], count: n)
    for i in 0..<m {
        let u = arr[2 + 2 * i]
        let v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        radj[v].append(u)
    }

    var visited = [Bool](repeating: false, count: n)
    var order = [Int]()

    func dfs1(_ v: Int) {
        visited[v] = true
        for w in adj[v] {
            if !visited[w] { dfs1(w) }
        }
        order.append(v)
    }

    for v in 0..<n {
        if !visited[v] { dfs1(v) }
    }

    visited = [Bool](repeating: false, count: n)
    var sccCount = 0

    func dfs2(_ v: Int) {
        visited[v] = true
        for w in radj[v] {
            if !visited[w] { dfs2(w) }
        }
    }

    for i in stride(from: order.count - 1, through: 0, by: -1) {
        let v = order[i]
        if !visited[v] {
            dfs2(v)
            sccCount += 1
        }
    }

    return sccCount
}
