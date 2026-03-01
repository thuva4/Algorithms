import Foundation

struct Node: Comparable {
    let r, c: Int
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
        elements.sort() // Maintain sorted order (simple implementation)
    }
    
    mutating func dequeue() -> T? {
        return isEmpty ? nil : elements.removeFirst()
    }
    
    func peek() -> T? {
        return elements.first
    }
}

class AStarBidirectional {
    static func solve(_ arr: [Int]) -> Int {
        if arr.count < 7 { return -1 }
        
        let rows = arr[0]
        let cols = arr[1]
        let sr = arr[2], sc = arr[3]
        let er = arr[4], ec = arr[5]
        let numObs = arr[6]
        
        if arr.count < 7 + 2 * numObs { return -1 }
        
        if sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols { return -1 }
        if sr == er && sc == ec { return 0 }
        
        var grid = [[Bool]](repeating: [Bool](repeating: false, count: cols), count: rows)
        for i in 0..<numObs {
            let r = arr[7 + 2 * i]
            let c = arr[7 + 2 * i + 1]
            if r >= 0 && r < rows && c >= 0 && c < cols {
                grid[r][c] = true
            }
        }
        
        if grid[sr][sc] || grid[er][ec] { return -1 }
        
        var openF = PriorityQueue<Node>()
        var openB = PriorityQueue<Node>()
        
        var gF = [[Int]](repeating: [Int](repeating: Int.max, count: cols), count: rows)
        var gB = [[Int]](repeating: [Int](repeating: Int.max, count: cols), count: rows)
        
        let hStart = abs(sr - er) + abs(sc - ec)
        gF[sr][sc] = 0
        openF.enqueue(Node(r: sr, c: sc, f: hStart, g: 0))
        
        let hEnd = abs(er - sr) + abs(ec - sc)
        gB[er][ec] = 0
        openB.enqueue(Node(r: er, c: ec, f: hEnd, g: 0))
        
        var bestPath = Int.max
        let dr = [-1, 1, 0, 0]
        let dc = [0, 0, -1, 1]
        
        while !openF.isEmpty && !openB.isEmpty {
            // Forward
            if !openF.isEmpty {
                if let u = openF.dequeue() {
                    if u.g <= gF[u.r][u.c] {
                        for i in 0..<4 {
                            let nr = u.r + dr[i]
                            let nc = u.c + dc[i]
                            
                            if nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc] {
                                let newG = u.g + 1
                                if newG < gF[nr][nc] {
                                    gF[nr][nc] = newG
                                    let h = abs(nr - er) + abs(nc - ec)
                                    openF.enqueue(Node(r: nr, c: nc, f: newG + h, g: newG))
                                    
                                    if gB[nr][nc] != Int.max {
                                        bestPath = min(bestPath, newG + gB[nr][nc])
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            // Backward
            if !openB.isEmpty {
                if let u = openB.dequeue() {
                    if u.g <= gB[u.r][u.c] {
                        for i in 0..<4 {
                            let nr = u.r + dr[i]
                            let nc = u.c + dc[i]
                            
                            if nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc] {
                                let newG = u.g + 1
                                if newG < gB[nr][nc] {
                                    gB[nr][nc] = newG
                                    let h = abs(nr - sr) + abs(nc - sc)
                                    openB.enqueue(Node(r: nr, c: nc, f: newG + h, g: newG))
                                    
                                    if gF[nr][nc] != Int.max {
                                        bestPath = min(bestPath, newG + gF[nr][nc])
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            let minF = openF.peek()?.f ?? Int.max
            let minB = openB.peek()?.f ?? Int.max
            
            if bestPath != Int.max && (minF + minB >= bestPath) {
                break
            }
        }
        
        return bestPath == Int.max ? -1 : bestPath
    }
}
