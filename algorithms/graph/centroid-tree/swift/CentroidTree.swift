class CentroidTree {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 1 { return 0 }
        let n = arr[0]
        
        if n <= 1 { return 0 }
        if arr.count < 1 + 2 * (n - 1) { return 0 }
        
        var adj = [[Int]](repeating: [], count: n)
        for i in 0..<n-1 {
            let u = arr[1 + 2 * i]
            let v = arr[1 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(v)
                adj[v].append(u)
            }
        }
        
        var sz = [Int](repeating: 0, count: n)
        var removed = [Bool](repeating: false, count: n)
        var maxDepth = 0
        
        func getSize(_ u: Int, _ p: Int) {
            sz[u] = 1
            for v in adj[u] {
                if v != p && !removed[v] {
                    getSize(v, u)
                    sz[u] += sz[v]
                }
            }
        }
        
        func getCentroid(_ u: Int, _ p: Int, _ total: Int) -> Int {
            for v in adj[u] {
                if v != p && !removed[v] && sz[v] > total / 2 {
                    return getCentroid(v, u, total)
                }
            }
            return u
        }
        
        func decompose(_ u: Int, _ depth: Int) {
            getSize(u, -1)
            let total = sz[u]
            let centroid = getCentroid(u, -1, total)
            
            if depth > maxDepth {
                maxDepth = depth
            }
            
            removed[centroid] = true
            
            for v in adj[centroid] {
                if !removed[v] {
                    decompose(v, depth + 1)
                }
            }
        }
        
        decompose(0, 0)
        
        return maxDepth
    }
}
