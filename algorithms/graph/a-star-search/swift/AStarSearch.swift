import Foundation

struct Node: Comparable {
    let id: Int
    let f, g: Int
    
    static func < (lhs: Node, rhs: Node) -> Bool {
        return lhs.f < rhs.f
    }
}

// Simple Priority Queue
struct PriorityQueue<T: Comparable> {
    private var elements: [T] = []
    
    var isEmpty: Bool {
        return elements.isEmpty
    }
    
    mutating func enqueue(_ element: T) {
        elements.append(element)
        elements.sort()
    }
    
    mutating func dequeue() -> T? {
        return isEmpty ? nil : elements.removeFirst()
    }
}

class AStarSearch {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 2 { return -1 }
        
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 3 * m + 2 + n { return -1 }
        
        let start = arr[2 + 3 * m]
        let goal = arr[2 + 3 * m + 1]
        
        if start < 0 || start >= n || goal < 0 || goal >= n { return -1 }
        if start == goal { return 0 }
        
        struct Edge {
            let to, weight: Int
        }
        
        var adj = [[Edge]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[2 + 3 * i]
            let v = arr[2 + 3 * i + 1]
            let w = arr[2 + 3 * i + 2]
            
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(Edge(to: v, weight: w))
            }
        }
        
        let hIndex = 2 + 3 * m + 2
        
        var openSet = PriorityQueue<Node>()
        var gScore = [Int](repeating: Int.max, count: n)
        
        gScore[start] = 0
        openSet.enqueue(Node(id: start, f: arr[hIndex + start], g: 0))
        
        while !openSet.isEmpty {
            guard let current = openSet.dequeue() else { break }
            let u = current.id
            
            if u == goal { return current.g }
            
            if current.g > gScore[u] { continue }
            
            for e in adj[u] {
                let v = e.to
                let w = e.weight
                
                if gScore[u] != Int.max && gScore[u] + w < gScore[v] {
                    gScore[v] = gScore[u] + w
                    let f = gScore[v] + arr[hIndex + v]
                    openSet.enqueue(Node(id: v, f: f, g: gScore[v]))
                }
            }
        }
        
        return -1
    }
}
