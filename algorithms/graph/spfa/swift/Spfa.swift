func spfa(_ arr: [Int]) -> Int {
    let n = arr[0]
    let m = arr[1]
    let src = arr[2]
    var adj = [[(Int, Int)]](repeating: [], count: n)
    for i in 0..<m {
        let u = arr[3 + 3 * i]
        let v = arr[3 + 3 * i + 1]
        let w = arr[3 + 3 * i + 2]
        adj[u].append((v, w))
    }

    let INF = Int.max / 2
    var dist = [Int](repeating: INF, count: n)
    dist[src] = 0
    var inQueue = [Bool](repeating: false, count: n)
    var queue = [Int]()
    var front = 0
    queue.append(src)
    inQueue[src] = true

    while front < queue.count {
        let u = queue[front]
        front += 1
        inQueue[u] = false
        for (v, w) in adj[u] {
            if dist[u] + w < dist[v] {
                dist[v] = dist[u] + w
                if !inQueue[v] {
                    queue.append(v)
                    inQueue[v] = true
                }
            }
        }
    }

    return dist[n - 1] == INF ? -1 : dist[n - 1]
}
