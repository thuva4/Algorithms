func treeDiameter(_ arr: [Int]) -> Int {
    var idx = 0
    let n = arr[idx]; idx += 1
    if n <= 1 { return 0 }

    var adj = Array(repeating: [Int](), count: n)
    let m = (arr.count - 1) / 2
    for _ in 0..<m {
        let u = arr[idx]; idx += 1
        let v = arr[idx]; idx += 1
        adj[u].append(v); adj[v].append(u)
    }

    func bfs(_ start: Int) -> (Int, Int) {
        var dist = Array(repeating: -1, count: n)
        dist[start] = 0
        var queue = [start]
        var front = 0
        var farthest = start
        while front < queue.count {
            let node = queue[front]; front += 1
            for nb in adj[node] {
                if dist[nb] == -1 {
                    dist[nb] = dist[node] + 1
                    queue.append(nb)
                    if dist[nb] > dist[farthest] { farthest = nb }
                }
            }
        }
        return (farthest, dist[farthest])
    }

    let (u, _) = bfs(0)
    let (_, diameter) = bfs(u)
    return diameter
}

print(treeDiameter([4, 0, 1, 1, 2, 2, 3]))
print(treeDiameter([5, 0, 1, 0, 2, 0, 3, 0, 4]))
print(treeDiameter([2, 0, 1]))
print(treeDiameter([1]))
