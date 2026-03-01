func lowestCommonAncestor(_ arr: [Int]) -> Int {
    var idx = 0
    let n = arr[idx]; idx += 1
    let root = arr[idx]; idx += 1

    var adj = Array(repeating: [Int](), count: n)
    for _ in 0..<n-1 {
        let u = arr[idx]; idx += 1
        let v = arr[idx]; idx += 1
        adj[u].append(v); adj[v].append(u)
    }
    let qa = arr[idx]; idx += 1
    let qb = arr[idx]

    var LOG = 1
    while (1 << LOG) < n { LOG += 1 }

    var depth = Array(repeating: 0, count: n)
    var up = Array(repeating: Array(repeating: -1, count: n), count: LOG)

    var visited = Array(repeating: false, count: n)
    visited[root] = true
    up[0][root] = root
    var queue = [root]
    var front = 0
    while front < queue.count {
        let v = queue[front]; front += 1
        for u in adj[v] {
            if !visited[u] {
                visited[u] = true
                depth[u] = depth[v] + 1
                up[0][u] = v
                queue.append(u)
            }
        }
    }

    for k in 1..<LOG {
        for v in 0..<n { up[k][v] = up[k-1][up[k-1][v]] }
    }

    var a = qa, b = qb
    if depth[a] < depth[b] { swap(&a, &b) }
    let diff = depth[a] - depth[b]
    for k in 0..<LOG { if (diff >> k) & 1 == 1 { a = up[k][a] } }
    if a == b { return a }
    for k in stride(from: LOG - 1, through: 0, by: -1) {
        if up[k][a] != up[k][b] { a = up[k][a]; b = up[k][b] }
    }
    return up[0][a]
}

print(lowestCommonAncestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2]))
print(lowestCommonAncestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3]))
print(lowestCommonAncestor([3, 0, 0, 1, 0, 2, 2, 2]))
print(lowestCommonAncestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4]))
