import Foundation

class Dijkstra {
    static let INF = 1000000000
    
    struct Edge {
        let to: Int
        let weight: Int
    }
    
    struct Node: Comparable {
        let u: Int
        let d: Int
        
        static func < (lhs: Node, rhs: Node) -> Bool {
            return lhs.d < rhs.d
        }
    }
    
    struct PriorityQueue<T: Comparable> {
        private var elements: [T] = []
        
        var isEmpty: Bool {
            return elements.isEmpty
        }
        
        mutating func enqueue(_ element: T) {
            elements.append(element)
            elements.sort() // Simple implementation
        }
        
        mutating func dequeue() -> T? {
            return isEmpty ? nil : elements.removeFirst()
        }
    }

    static func solve(_ arr: [Int]) -> [Int] {
        if arr.count < 2 { return [] }
        
        let n = arr[0]
        let m = arr[1]
        
        if arr.count < 2 + 3 * m + 1 { return [] }
        
        let start = arr[2 + 3 * m]
        if start < 0 || start >= n { return [] }
        
        var adj = [[Edge]](repeating: [], count: n)
        for i in 0..<m {
            let u = arr[2 + 3 * i]
            let v = arr[2 + 3 * i + 1]
            let w = arr[2 + 3 * i + 2]
            if u >= 0 && u < n && v >= 0 && v < n {
                adj[u].append(Edge(to: v, weight: w))
            }
        }
        
        var dist = [Int](repeating: INF, count: n)
        dist[start] = 0
        
        var pq = PriorityQueue<Node>()
        pq.enqueue(Node(u: start, d: 0))
        
        while !pq.isEmpty {
            guard let current = pq.dequeue() else { break }
            let u = current.u
            let d = current.d
            
            if d > dist[u] { continue }
            
            for e in adj[u] {
                if dist[u] + e.weight < dist[e.to] {
                    dist[e.to] = dist[u] + e.weight
                    pq.enqueue(Node(u: e.to, d: dist[e.to]))
                }
            }
        }
        
        return dist
    }
}
