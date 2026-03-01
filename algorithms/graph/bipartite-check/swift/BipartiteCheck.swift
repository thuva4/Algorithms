import Foundation

class BipartiteCheck {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 2 { return 0 }
        
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 2 * m { return 0 }
        if n == 0 { return 1 }
        
        var adj = [[Int]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[2 + 2 * i]
            let v = arr[2 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(v)
                adj[v].append(u)
            }
        }
        
        var color = [Int](repeating: 0, count: n) // 0: none, 1: red, -1: blue
        var q = [Int]()
        
        for i in 0..<n {
            if color[i] == 0 {
                color[i] = 1
                q.append(i)
                
                var head = 0
                while head < q.count {
                    let u = q[head]
                    head += 1
                    
                    for v in adj[u] {
                        if color[v] == 0 {
                            color[v] = -color[u]
                            q.append(v)
                        } else if color[v] == color[u] {
                            return 0
                        }
                    }
                }
                q.removeAll()
            }
        }
        
        return 1
    }
}
