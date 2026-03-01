class TwoSat {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 2 { return 0 }
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 2 * m { return 0 }
        
        let numNodes = 2 * n
        var adj = [[Int]](repeating: [], count: numNodes)
        
        for i in 0..<m {
            let uRaw = arr[2 + 2 * i]
            let vRaw = arr[2 + 2 * i + 1]
            
            let u = (abs(uRaw) - 1) * 2 + (uRaw < 0 ? 1 : 0)
            let v = (abs(vRaw) - 1) * 2 + (vRaw < 0 ? 1 : 0)
            
            let notU = u ^ 1
            let notV = v ^ 1
            
            adj[notU].append(v)
            adj[notV].append(u)
        }
        
        var dfn = [Int](repeating: 0, count: numNodes)
        var low = [Int](repeating: 0, count: numNodes)
        var sccId = [Int](repeating: 0, count: numNodes)
        var inStack = [Bool](repeating: false, count: numNodes)
        var stack = [Int]()
        var timer = 0
        var sccCnt = 0
        
        func tarjan(_ u: Int) {
            timer += 1
            dfn[u] = timer
            low[u] = timer
            stack.append(u)
            inStack[u] = true
            
            for v in adj[u] {
                if dfn[v] == 0 {
                    tarjan(v)
                    low[u] = min(low[u], low[v])
                } else if inStack[v] {
                    low[u] = min(low[u], dfn[v])
                }
            }
            
            if low[u] == dfn[u] {
                sccCnt += 1
                var v = -1
                repeat {
                    v = stack.removeLast()
                    inStack[v] = false
                    sccId[v] = sccCnt
                } while u != v
            }
        }
        
        for i in 0..<numNodes {
            if dfn[i] == 0 {
                tarjan(i)
            }
        }
        
        for i in 0..<n {
            if sccId[2 * i] == sccId[2 * i + 1] {
                return 0
            }
        }
        
        return 1
    }
}
