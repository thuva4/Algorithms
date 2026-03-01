func eulerPath(_ arr: [Int]) -> Int {
    let n = arr[0], m = arr[1]
    if n == 0 { return 1 }
    var adj = [[Int]](repeating: [], count: n)
    var degree = [Int](repeating: 0, count: n)
    for i in 0..<m {
        let u = arr[2+2*i], v = arr[3+2*i]
        adj[u].append(v); adj[v].append(u)
        degree[u] += 1; degree[v] += 1
    }
    for d in degree { if d % 2 != 0 { return 0 } }
    var start = -1
    for i in 0..<n { if degree[i] > 0 { start = i; break } }
    if start == -1 { return 1 }
    var visited = [Bool](repeating: false, count: n)
    var stack = [start]
    visited[start] = true
    while !stack.isEmpty {
        let v = stack.removeLast()
        for u in adj[v] { if !visited[u] { visited[u] = true; stack.append(u) } }
    }
    for i in 0..<n { if degree[i] > 0 && !visited[i] { return 0 } }
    return 1
}
