import Foundation

class BipartiteMatching {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 3 { return 0 }
        
        let nLeft = arr[0]
        let nRight = arr[1]
        let m = arr[2]
        
        if arr.count < 3 + 2 * m { return 0 }
        if nLeft == 0 || nRight == 0 { return 0 }
        
        var adj = [[Int]](repeating: [], count: nLeft)
        for i in 0..<m {
            let u = arr[3 + 2 * i]
            let v = arr[3 + 2 * i + 1]
            if u >= 0 && u < nLeft && v >= 0 && v < nRight {
                adj[u].append(v)
            }
        }
        
        var pairU = [Int](repeating: -1, count: nLeft)
        var pairV = [Int](repeating: -1, count: nRight)
        var dist = [Int](repeating: 0, count: nLeft + 1)
        
        func bfs() -> Bool {
            var q = [Int]()
            for u in 0..<nLeft {
                if pairU[u] == -1 {
                    dist[u] = 0
                    q.append(u)
                } else {
                    dist[u] = Int.max
                }
            }
            
            dist[nLeft] = Int.max
            
            var head = 0
            while head < q.count {
                let u = q[head]
                head += 1
                
                if dist[u] < dist[nLeft] {
                    for v in adj[u] {
                        let pu = pairV[v]
                        if pu == -1 {
                            if dist[nLeft] == Int.max {
                                dist[nLeft] = dist[u] + 1
                            }
                        } else if dist[pu] == Int.max {
                            dist[pu] = dist[u] + 1
                            q.append(pu)
                        }
                    }
                }
            }
            
            return dist[nLeft] != Int.max
        }
        
        func dfs(_ u: Int) -> Bool {
            if u != -1 {
                for v in adj[u] {
                    let pu = pairV[v]
                    if pu == -1 || (dist[pu] == dist[u] + 1 && dfs(pu)) {
                        pairV[v] = u
                        pairU[u] = v
                        return true
                    }
                }
                dist[u] = Int.max
                return false
            }
            return true
        }
        
        var matching = 0
        while bfs() {
            for u in 0..<nLeft {
                if pairU[u] == -1 && dfs(u) {
                    matching += 1
                }
            }
        }
        
        return matching
    }
}
