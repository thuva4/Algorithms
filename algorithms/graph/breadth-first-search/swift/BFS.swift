import Foundation

class Bfs {
    static func solve(_ arr: [Int]) -> [Int] {
        if arr.count < 2 { return [] }
        
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 2 * m + 1 { return [] }
        
        let start = arr[2 + 2 * m]
        if start < 0 || start >= n { return [] }
        
        var adj = [[Int]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[2 + 2 * i]
            let v = arr[2 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(v)
                adj[v].append(u)
            }
        }
        
        for i in 0..<n {
            adj[i].sort()
        }
        
        var result = [Int]()
        var visited = [Bool](repeating: false, count: n)
        var q = [start]
        visited[start] = true
        
        var head = 0
        while head < q.count {
            let u = q[head]
            head += 1
            result.append(u)
            
            for v in adj[u] {
                if !visited[v] {
                    visited[v] = true
                    q.append(v)
                }
            }
        }
        
        return result
    }
}
