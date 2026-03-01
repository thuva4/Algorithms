private var capSFF: [[Int]] = []
private var nSFF = 0

private func dfsSFF(_ u: Int, _ sink: Int, _ flow: Int, _ visited: inout [Bool]) -> Int {
    if u == sink { return flow }
    visited[u] = true
    for v in 0..<nSFF {
        if !visited[v] && capSFF[u][v] > 0 {
            let d = dfsSFF(v, sink, min(flow, capSFF[u][v]), &visited)
            if d > 0 { capSFF[u][v] -= d; capSFF[v][u] += d; return d }
        }
    }
    return 0
}

func fordFulkerson(_ arr: [Int]) -> Int {
    nSFF = arr[0]; let m = arr[1]; let src = arr[2]; let sink = arr[3]
    capSFF = [[Int]](repeating: [Int](repeating: 0, count: nSFF), count: nSFF)
    for i in 0..<m { capSFF[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i] }
    var maxFlow = 0
    while true {
        var visited = [Bool](repeating: false, count: nSFF)
        let flow = dfsSFF(src, sink, Int.max, &visited)
        if flow == 0 { break }
        maxFlow += flow
    }
    return maxFlow
}
