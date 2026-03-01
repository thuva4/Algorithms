class Bridges {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 2 { return 0 }
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 2 * m { return 0 }
        
        var adj = [[Int]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[2 + 2 * i]
            let v = arr[2 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(v)
                adj[v].append(u)
            }
        }
        
        var dfn = [Int](repeating: 0, count: n)
        var low = [Int](repeating: 0, count: n)
        var timer = 0
        var bridgeCount = 0
        
        func dfs(_ u: Int, _ p: Int) {
            timer += 1
            dfn[u] = timer
            low[u] = timer
            
            for v in adj[u] {
                if v == p { continue }
                if dfn[v] != 0 {
                    low[u] = min(low[u], dfn[v])
                } else {
                    dfs(v, u)
                    low[u] = min(low[u], low[v])
                    if low[v] > dfn[u] {
                        bridgeCount += 1
                    }
                }
            }
        }
        
        for i in 0..<n {
            if dfn[i] == 0 {
                dfs(i, -1)
            }
        }
        
        return bridgeCount
    }
}
