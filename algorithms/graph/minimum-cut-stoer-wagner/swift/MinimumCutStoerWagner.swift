func minimumCutStoerWagner(_ arr: [Int]) -> Int {
    let n = arr[0]
    let m = arr[1]
    var w = [[Int]](repeating: [Int](repeating: 0, count: n), count: n)
    var idx = 2
    for _ in 0..<m {
        let u = arr[idx], v = arr[idx + 1], c = arr[idx + 2]
        w[u][v] += c
        w[v][u] += c
        idx += 3
    }

    var merged = [Bool](repeating: false, count: n)
    var best = Int.max

    for phase in 0..<(n - 1) {
        var key = [Int](repeating: 0, count: n)
        var inA = [Bool](repeating: false, count: n)
        var prev = -1
        var last = -1

        for _ in 0..<(n - phase) {
            var sel = -1
            for v in 0..<n {
                if !merged[v] && !inA[v] {
                    if sel == -1 || key[v] > key[sel] {
                        sel = v
                    }
                }
            }
            inA[sel] = true
            prev = last
            last = sel
            for v in 0..<n {
                if !merged[v] && !inA[v] {
                    key[v] += w[sel][v]
                }
            }
        }

        if key[last] < best { best = key[last] }

        for v in 0..<n {
            w[prev][v] += w[last][v]
            w[v][prev] += w[v][last]
        }
        merged[last] = true
    }

    return best
}
