func topologicalSortAll(_ arr: [Int]) -> Int {
    let n = arr[0]; let m = arr[1]
    var adj = [[Int]](repeating: [], count: n)
    var inDeg = [Int](repeating: 0, count: n)
    for i in 0..<m {
        let u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1]
        adj[u].append(v); inDeg[v] += 1
    }
    var visited = [Bool](repeating: false, count: n)
    var count = 0

    func backtrack(_ placed: Int) {
        if placed == n { count += 1; return }
        for v in 0..<n {
            if !visited[v] && inDeg[v] == 0 {
                visited[v] = true
                for w in adj[v] { inDeg[w] -= 1 }
                backtrack(placed + 1)
                visited[v] = false
                for w in adj[v] { inDeg[w] += 1 }
            }
        }
    }

    backtrack(0)
    return count
}
