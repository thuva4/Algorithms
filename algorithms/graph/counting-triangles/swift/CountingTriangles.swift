class CountingTriangles {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 2 { return 0 }
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 2 * m { return 0 }
        if n < 3 { return 0 }
        
        var adj = [[Bool]](repeating: [Bool](repeating: false, count: n), count: n)
        for i in 0..<m {
            let u = arr[2 + 2 * i]
            let v = arr[2 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u][v] = true
                adj[v][u] = true
            }
        }
        
        var count = 0
        for i in 0..<n {
            for j in i+1..<n {
                if adj[i][j] {
                    for k in j+1..<n {
                        if adj[j][k] && adj[k][i] {
                            count += 1
                        }
                    }
                }
            }
        }
        
        return count
    }
}
