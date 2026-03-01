func maximumBipartiteMatching(_ arr: [Int]) -> Int {
    let nLeft = arr[0], nRight = arr[1], m = arr[2]
    var adj = [[Int]](repeating: [], count: nLeft)
    for i in 0..<m { adj[arr[3 + 2 * i]].append(arr[3 + 2 * i + 1]) }
    var matchRight = [Int](repeating: -1, count: nRight)

    func dfs(_ u: Int, _ visited: inout [Bool]) -> Bool {
        for v in adj[u] {
            if !visited[v] {
                visited[v] = true
                if matchRight[v] == -1 || dfs(matchRight[v], &visited) {
                    matchRight[v] = u; return true
                }
            }
        }
        return false
    }

    var result = 0
    for u in 0..<nLeft {
        var visited = [Bool](repeating: false, count: nRight)
        if dfs(u, &visited) { result += 1 }
    }
    return result
}
