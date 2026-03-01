class Dinic {
    class Edge {
        let to: Int
        let rev: Int
        var cap: Int64
        var flow: Int64
        
        init(to: Int, rev: Int, cap: Int64) {
            self.to = to
            self.rev = rev
            self.cap = cap
            self.flow = 0
        }
    }
    
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 4 { return 0 }
        let n = arr[0]
        let m = arr[1]
        let s = arr[2]
        let t = arr[3]
        
        if arr.count < 4 + 3 * m { return 0 }
        
        var adj = [[Edge]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[4 + 3 * i]
            let v = arr[4 + 3 * i + 1]
            let cap = Int64(arr[4 + 3 * i + 2])
            if u >= 0 && u < n && v >= 0 && v < n {
                let a = Edge(to: v, rev: adj[v].count, cap: cap)
                let b = Edge(to: u, rev: adj[u].count, cap: 0)
                adj[u].append(a)
                adj[v].append(b)
            }
        }
        
        var level = [Int](repeating: -1, count: n)
        var ptr = [Int](repeating: 0, count: n)
        
        func bfs() -> Bool {
            level = [Int](repeating: -1, count: n)
            level[s] = 0
            var q = [s]
            var head = 0
            
            while head < q.count {
                let u = q[head]
                head += 1
                for e in adj[u] {
                    if e.cap - e.flow > 0 && level[e.to] == -1 {
                        level[e.to] = level[u] + 1
                        q.append(e.to)
                    }
                }
            }
            return level[t] != -1
        }
        
        func dfs(_ u: Int, _ pushed: Int64) -> Int64 {
            if pushed == 0 { return 0 }
            if u == t { return pushed }
            
            while ptr[u] < adj[u].count {
                let id = ptr[u]
                let e = adj[u][id]
                let v = e.to
                
                if level[u] + 1 != level[v] || e.cap - e.flow == 0 {
                    ptr[u] += 1
                    continue
                }
                
                let tr = min(pushed, e.cap - e.flow)
                let pushedFlow = dfs(v, tr)
                
                if pushedFlow == 0 {
                    ptr[u] += 1
                    continue
                }
                
                e.flow += pushedFlow
                adj[v][e.rev].flow -= pushedFlow
                return pushedFlow
            }
            return 0
        }
        
        var flow: Int64 = 0
        while bfs() {
            ptr = [Int](repeating: 0, count: n)
            while true {
                let pushed = dfs(s, Int64.max)
                if pushed == 0 { break }
                flow += pushed
            }
        }
        
        return Int(flow)
    }
}
