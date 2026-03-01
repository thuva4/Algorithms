func countBridges(_ arr: [Int]) -> Int {
    let n = arr[0]
    let m = arr[1]
    var adj = [[Int]](repeating: [], count: n)
    for i in 0..<m {
        let u = arr[2 + 2 * i]
        let v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        adj[v].append(u)
    }

    var disc = [Int](repeating: -1, count: n)
    var low = [Int](repeating: 0, count: n)
    var parent = [Int](repeating: -1, count: n)
    var timer = 0
    var bridgeCount = 0

    func dfs(_ u: Int) {
        disc[u] = timer
        low[u] = timer
        timer += 1

        for v in adj[u] {
            if disc[v] == -1 {
                parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u] { bridgeCount += 1 }
            } else if v != parent[u] {
                low[u] = min(low[u], disc[v])
            }
        }
    }

    for i in 0..<n {
        if disc[i] == -1 { dfs(i) }
    }

    return bridgeCount
}
