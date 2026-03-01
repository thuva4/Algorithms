func stronglyConnectedCondensation(_ arr: [Int]) -> Int {
    let n = arr[0]
    let m = arr[1]
    var adj = [[Int]](repeating: [], count: n)
    for i in 0..<m {
        let u = arr[2 + 2 * i]
        let v = arr[2 + 2 * i + 1]
        adj[u].append(v)
    }

    var indexCounter = 0
    var sccCount = 0
    var disc = [Int](repeating: -1, count: n)
    var low = [Int](repeating: 0, count: n)
    var onStack = [Bool](repeating: false, count: n)
    var stack = [Int]()

    func strongconnect(_ v: Int) {
        disc[v] = indexCounter
        low[v] = indexCounter
        indexCounter += 1
        stack.append(v)
        onStack[v] = true

        for w in adj[v] {
            if disc[w] == -1 {
                strongconnect(w)
                low[v] = min(low[v], low[w])
            } else if onStack[w] {
                low[v] = min(low[v], disc[w])
            }
        }

        if low[v] == disc[v] {
            sccCount += 1
            while true {
                let w = stack.removeLast()
                onStack[w] = false
                if w == v { break }
            }
        }
    }

    for v in 0..<n {
        if disc[v] == -1 { strongconnect(v) }
    }

    return sccCount
}
