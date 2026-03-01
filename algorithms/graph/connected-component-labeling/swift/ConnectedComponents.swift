import Foundation

class ConnectedComponents {
    static func solve(_ arr: [Int]) -> [Int] {
        if arr.count < 2 { return [] }
        
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 2 * m { return [] }
        if n == 0 { return [] }
        
        var adj = [[Int]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[2 + 2 * i]
            let v = arr[2 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(v)
                adj[v].append(u)
            }
        }
        
        var labels = [Int](repeating: -1, count: n)
        var q = [Int]()
        
        for i in 0..<n {
            if labels[i] == -1 {
                let componentId = i
                labels[i] = componentId
                q.append(i)
                
                var head = 0
                while head < q.count {
                    let u = q[head]
                    head += 1
                    
                    for v in adj[u] {
                        if labels[v] == -1 {
                            labels[v] = componentId
                            q.append(v)
                        }
                    }
                }
                q.removeAll()
            }
        }
        
        return labels
    }
}
