class AllPairsShortestPath {
    static let INF = 1000000000

    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 2 { return -1 }
        
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 3 * m { return -1 }
        if n <= 0 { return -1 }
        if n == 1 { return 0 }
        
        var dist = [[Int]](repeating: [Int](repeating: INF, count: n), count: n)
        for i in 0..<n {
            dist[i][i] = 0
        }
        
        for i in 0..<m {
            let u = arr[2 + 3 * i]
            let v = arr[2 + 3 * i + 1]
            let w = arr[2 + 3 * i + 2]
            
            if u >= 0 && u < n && v >= 0 && v < n {
                dist[u][v] = min(dist[u][v], w)
            }
        }
        
        for k in 0..<n {
            for i in 0..<n {
                for j in 0..<n {
                    if dist[i][k] != INF && dist[k][j] != INF {
                        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
                    }
                }
            }
        }
        
        return dist[0][n - 1] == INF ? -1 : dist[0][n - 1]
    }
}
