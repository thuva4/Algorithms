func primsFibonacciHeap(_ arr: [Int]) -> Int {
    let n = arr[0]; let m = arr[1]
    var adj = [[(Int, Int)]](repeating: [], count: n)
    for i in 0..<m {
        let u = arr[2+3*i], v = arr[2+3*i+1], w = arr[2+3*i+2]
        adj[u].append((w, v)); adj[v].append((w, u))
    }

    let INF = Int.max
    var inMst = [Bool](repeating: false, count: n)
    var key = [Int](repeating: INF, count: n)
    key[0] = 0
    var total = 0

    for _ in 0..<n {
        var u = -1
        for v in 0..<n {
            if !inMst[v] && (u == -1 || key[v] < key[u]) { u = v }
        }
        inMst[u] = true; total += key[u]
        for (w, v) in adj[u] {
            if !inMst[v] && w < key[v] { key[v] = w }
        }
    }

    return total
}
