func chromaticNumber(_ arr: [Int]) -> Int {
    let n = arr[0]
    let m = arr[1]
    if n == 0 { return 0 }
    if m == 0 { return 1 }

    var adj = [[Int]](repeating: [], count: n)
    for i in 0..<m {
        let u = arr[2 + 2 * i]
        let v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        adj[v].append(u)
    }

    func isSafe(_ colors: [Int], _ v: Int, _ c: Int) -> Bool {
        for u in adj[v] {
            if colors[u] == c { return false }
        }
        return true
    }

    func solve(_ colors: inout [Int], _ v: Int, _ k: Int) -> Bool {
        if v == n { return true }
        for c in 1...k {
            if isSafe(colors, v, c) {
                colors[v] = c
                if solve(&colors, v + 1, k) { return true }
                colors[v] = 0
            }
        }
        return false
    }

    for k in 1...n {
        var colors = [Int](repeating: 0, count: n)
        if solve(&colors, 0, k) { return k }
    }
    return n
}
