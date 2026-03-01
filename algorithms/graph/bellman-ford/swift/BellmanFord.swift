class BellmanFord {
    static let INF = 1000000000

    static func solve(_ arr: [Int]) -> [Int] {
        if arr.count < 2 { return [] }
        
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 3 * m + 1 { return [] }
        
        let start = arr[2 + 3 * m]
        
        if start < 0 || start >= n { return [] }
        
        var dist = [Int](repeating: INF, count: n)
        dist[start] = 0
        
        for _ in 0..<n-1 {
            for j in 0..<m {
                let u = arr[2 + 3 * j]
                let v = arr[2 + 3 * j + 1]
                let w = arr[2 + 3 * j + 2]
                
                if dist[u] != INF && dist[u] + w < dist[v] {
                    dist[v] = dist[u] + w
                }
            }
        }
        
        for j in 0..<m {
            let u = arr[2 + 3 * j]
            let v = arr[2 + 3 * j + 1]
            let w = arr[2 + 3 * j + 2]
            
            if dist[u] != INF && dist[u] + w < dist[v] {
                return [] // Negative cycle
            }
        }
        
        return dist
    }
}
