import Foundation

struct Node: Comparable {
    let id: Int
    let heuristic: Int
    
    static func < (lhs: Node, rhs: Node) -> Bool {
        return lhs.heuristic < rhs.heuristic
    }
}

// Simple Priority Queue wrapper around an array (inefficient O(N) insert/pop but functional)
// Ideally use a Heap implementation.
struct PriorityQueue<T: Comparable> {
    private var elements: [T] = []
    
    var isEmpty: Bool {
        return elements.isEmpty
    }
    
    mutating func enqueue(_ element: T) {
        elements.append(element)
        elements.sort() // Maintaining sorted order
    }
    
    mutating func dequeue() -> T? {
        return isEmpty ? nil : elements.removeFirst()
    }
}

class BestFirstSearch {
    static func search(n: Int, adj: [[Int]], start: Int, target: Int, heuristic: [Int]) -> [Int] {
        var pq = PriorityQueue<Node>()
        var visited = [Bool](repeating: false, count: n)
        var parent = [Int](repeating: -1, count: n)
        
        pq.enqueue(Node(id: start, heuristic: heuristic[start]))
        visited[start] = true
        
        var found = false
        
        while !pq.isEmpty {
            guard let current = pq.dequeue() else { break }
            let u = current.id
            
            if u == target {
                found = true
                break
            }
            
            for v in adj[u] {
                if !visited[v] {
                    visited[v] = true
                    parent[v] = u
                    pq.enqueue(Node(id: v, heuristic: heuristic[v]))
                }
            }
        }
        
        if found {
            var path: [Int] = []
            var curr = target
            while curr != -1 {
                path.append(curr)
                curr = parent[curr]
            }
            return path.reversed()
        }
        
        return []
    }
}
