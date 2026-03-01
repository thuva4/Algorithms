class ChromaticNumber {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 2 { return 0 }
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 2 * m { return 0 }
        if n == 0 { return 0 }
        
        var adj = [[Bool]](repeating: [Bool](repeating: false, count: n), count: n)
        for i in 0..<m {
            let u = arr[2 + 2 * i]
            let v = arr[2 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u][v] = true
                adj[v][u] = true
            }
        }
        
        var color = [Int](repeating: 0, count: n)
        
        func isSafe(_ u: Int, _ c: Int) -> Bool {
            for v in 0..<n {
                if adj[u][v] && color[v] == c {
                    return false
                }
            }
            return true
        }
        
        func graphColoringUtil(_ u: Int, _ k: Int) -> Bool {
            if u == n { return true }
            
            for c in 1...k {
                if isSafe(u, c) {
                    color[u] = c
                    if graphColoringUtil(u + 1, k) {
                        return true
                    }
                    color[u] = 0
                }
            }
            return false
        }
        
        for k in 1...n {
            if graphColoringUtil(0, k) {
                return k
            }
        }
        
        return n
    }
}
