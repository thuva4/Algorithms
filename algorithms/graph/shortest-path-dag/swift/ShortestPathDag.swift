/// Find shortest path from source to vertex n-1 in a DAG.
///
/// Input format: [n, m, src, u1, v1, w1, ...]
/// - Parameter arr: input array
/// - Returns: shortest distance from src to n-1, or -1 if unreachable
func shortestPathDag(_ arr: [Int]) -> Int {
    var idx = 0
    let n = arr[idx]; idx += 1
    let m = arr[idx]; idx += 1
    let src = arr[idx]; idx += 1

    var adj = Array(repeating: [(Int, Int)](), count: n)
    var inDegree = Array(repeating: 0, count: n)
    for _ in 0..<m {
        let u = arr[idx]; idx += 1
        let v = arr[idx]; idx += 1
        let w = arr[idx]; idx += 1
        adj[u].append((v, w))
        inDegree[v] += 1
    }

    var queue = [Int]()
    for i in 0..<n {
        if inDegree[i] == 0 { queue.append(i) }
    }

    var topoOrder = [Int]()
    var front = 0
    while front < queue.count {
        let node = queue[front]; front += 1
        topoOrder.append(node)
        for (v, _) in adj[node] {
            inDegree[v] -= 1
            if inDegree[v] == 0 { queue.append(v) }
        }
    }

    let INF = Int.max
    var dist = Array(repeating: INF, count: n)
    dist[src] = 0

    for u in topoOrder {
        if dist[u] == INF { continue }
        for (v, w) in adj[u] {
            if dist[u] + w < dist[v] { dist[v] = dist[u] + w }
        }
    }

    return dist[n - 1] == INF ? -1 : dist[n - 1]
}

print(shortestPathDag([4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7]))
print(shortestPathDag([3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1]))
print(shortestPathDag([2, 1, 0, 0, 1, 10]))
print(shortestPathDag([3, 1, 0, 1, 2, 5]))
