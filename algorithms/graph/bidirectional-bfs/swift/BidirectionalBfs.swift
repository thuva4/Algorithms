import Foundation

class BidirectionalBfs {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 4 { return -1 }
        
        let n = arr[0]
        let m = arr[1]
        let start = arr[2]
        let end = arr[3]
        
        if arr.count < 4 + 2 * m { return -1 }
        if start == end { return 0 }
        
        var adj = [[Int]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[4 + 2 * i]
            let v = arr[4 + 2 * i + 1]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(v)
                adj[v].append(u)
            }
        }
        
        var distStart = [Int](repeating: -1, count: n)
        var distEnd = [Int](repeating: -1, count: n)
        
        var qStart = [start]
        distStart[start] = 0
        
        var qEnd = [end]
        distEnd[end] = 0
        
        var qStartIndex = 0
        var qEndIndex = 0
        
        while qStartIndex < qStart.count && qEndIndex < qEnd.count {
            // Start
            let u = qStart[qStartIndex]
            qStartIndex += 1
            
            if distEnd[u] != -1 {
                return distStart[u] + distEnd[u]
            }
            
            for v in adj[u] {
                if distStart[v] == -1 {
                    distStart[v] = distStart[u] + 1
                    if distEnd[v] != -1 {
                        return distStart[v] + distEnd[v]
                    }
                    qStart.append(v)
                }
            }
            
            // End
            let w = qEnd[qEndIndex]
            qEndIndex += 1
            
            if distStart[w] != -1 {
                return distStart[w] + distEnd[w]
            }
            
            for v in adj[w] {
                if distEnd[v] == -1 {
                    distEnd[v] = distEnd[w] + 1
                    if distStart[v] != -1 {
                        return distStart[v] + distEnd[v]
                    }
                    qEnd.append(v)
                }
            }
        }
        
        return -1
    }
}
