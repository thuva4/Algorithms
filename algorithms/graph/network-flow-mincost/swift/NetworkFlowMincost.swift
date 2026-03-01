func networkFlowMincost(_ arr: [Int]) -> Int {
    let n = arr[0], m = arr[1], src = arr[2], sink = arr[3]
    var head = [Int](repeating: -1, count: n)
    var to = [Int](), cap = [Int](), cost = [Int](), nxt = [Int]()
    var edgeCnt = 0

    func addEdge(_ u: Int, _ v: Int, _ c: Int, _ w: Int) {
        to.append(v); cap.append(c); cost.append(w); nxt.append(head[u]); head[u] = edgeCnt; edgeCnt += 1
        to.append(u); cap.append(0); cost.append(-w); nxt.append(head[v]); head[v] = edgeCnt; edgeCnt += 1
    }

    for i in 0..<m {
        addEdge(arr[4 + 4 * i], arr[4 + 4 * i + 1], arr[4 + 4 * i + 2], arr[4 + 4 * i + 3])
    }

    let INF = Int.max / 2
    var totalCost = 0

    while true {
        var dist = [Int](repeating: INF, count: n)
        dist[src] = 0
        var inQueue = [Bool](repeating: false, count: n)
        var prevEdge = [Int](repeating: -1, count: n)
        var prevNode = [Int](repeating: -1, count: n)
        var q = [Int](); var qi = 0
        q.append(src); inQueue[src] = true

        while qi < q.count {
            let u = q[qi]; qi += 1
            inQueue[u] = false
            var e = head[u]
            while e != -1 {
                let v = to[e]
                if cap[e] > 0 && dist[u] + cost[e] < dist[v] {
                    dist[v] = dist[u] + cost[e]
                    prevEdge[v] = e; prevNode[v] = u
                    if !inQueue[v] { q.append(v); inQueue[v] = true }
                }
                e = nxt[e]
            }
        }

        if dist[sink] == INF { break }

        var bottleneck = INF
        var v = sink
        while v != src { bottleneck = min(bottleneck, cap[prevEdge[v]]); v = prevNode[v] }

        v = sink
        while v != src {
            let e = prevEdge[v]
            cap[e] -= bottleneck; cap[e ^ 1] += bottleneck
            v = prevNode[v]
        }

        totalCost += bottleneck * dist[sink]
    }

    return totalCost
}
