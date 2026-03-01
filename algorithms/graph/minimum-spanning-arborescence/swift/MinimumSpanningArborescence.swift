func minimumSpanningArborescence(_ arr: [Int]) -> Int {
    var n = arr[0]
    let m = arr[1]
    var root = arr[2]
    var eu = (0..<m).map { arr[3 + 3 * $0] }
    var ev = (0..<m).map { arr[3 + 3 * $0 + 1] }
    var ew = (0..<m).map { arr[3 + 3 * $0 + 2] }

    let INF = Int.max / 2
    var res = 0

    while true {
        var minIn = [Int](repeating: INF, count: n)
        var minEdge = [Int](repeating: -1, count: n)

        for i in 0..<eu.count {
            if eu[i] != ev[i] && ev[i] != root && ew[i] < minIn[ev[i]] {
                minIn[ev[i]] = ew[i]
                minEdge[ev[i]] = eu[i]
            }
        }

        for i in 0..<n {
            if i != root && minIn[i] == INF { return -1 }
        }

        var comp = [Int](repeating: -1, count: n)
        comp[root] = root
        var numCycles = 0

        for i in 0..<n {
            if i != root { res += minIn[i] }
        }

        var visited = [Int](repeating: -1, count: n)
        for i in 0..<n {
            if i == root { continue }
            var v = i
            while visited[v] == -1 && comp[v] == -1 && v != root {
                visited[v] = i
                v = minEdge[v]
            }
            if v != root && comp[v] == -1 && visited[v] == i {
                var u = v
                repeat {
                    comp[u] = numCycles
                    u = minEdge[u]
                } while u != v
                numCycles += 1
            }
        }

        if numCycles == 0 { break }

        for i in 0..<n {
            if comp[i] == -1 {
                comp[i] = numCycles
                numCycles += 1
            }
        }

        var neu = [Int](), nev = [Int](), newW = [Int]()
        for i in 0..<eu.count {
            let nu = comp[eu[i]], nv = comp[ev[i]]
            if nu != nv {
                neu.append(nu)
                nev.append(nv)
                newW.append(ew[i] - minIn[ev[i]])
            }
        }

        eu = neu; ev = nev; ew = newW
        root = comp[root]
        n = numCycles
    }

    return res
}
