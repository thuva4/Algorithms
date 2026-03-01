func graphCycleDetection(_ arr: [Int]) -> Int {
    let n = arr[0]; let m = arr[1]
    var adj = [[Int]](repeating: [], count: n)
    for i in 0..<m { adj[arr[2 + 2 * i]].append(arr[2 + 2 * i + 1]) }
    var color = [Int](repeating: 0, count: n)

    func dfs(_ v: Int) -> Bool {
        color[v] = 1
        for w in adj[v] {
            if color[w] == 1 { return true }
            if color[w] == 0 && dfs(w) { return true }
        }
        color[v] = 2
        return false
    }

    for v in 0..<n {
        if color[v] == 0 && dfs(v) { return 1 }
    }
    return 0
}
