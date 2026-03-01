func maxFlowMinCut(_ arr: [Int]) -> Int {
    let n = arr[0], m = arr[1], src = arr[2], sink = arr[3]
    var cap = [[Int]](repeating: [Int](repeating: 0, count: n), count: n)
    for i in 0..<m { cap[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i] }
    var maxFlow = 0
    while true {
        var parent = [Int](repeating: -1, count: n)
        parent[src] = src
        var queue = [src]
        var front = 0
        while front < queue.count && parent[sink] == -1 {
            let u = queue[front]; front += 1
            for v in 0..<n {
                if parent[v] == -1 && cap[u][v] > 0 { parent[v] = u; queue.append(v) }
            }
        }
        if parent[sink] == -1 { break }
        var flow = Int.max
        var v = sink
        while v != src { flow = min(flow, cap[parent[v]][v]); v = parent[v] }
        v = sink
        while v != src { cap[parent[v]][v] -= flow; cap[v][parent[v]] += flow; v = parent[v] }
        maxFlow += flow
    }
    return maxFlow
}
