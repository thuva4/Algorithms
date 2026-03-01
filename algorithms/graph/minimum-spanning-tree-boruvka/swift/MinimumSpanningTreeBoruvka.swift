/// Find the minimum spanning tree using Boruvka's algorithm.
///
/// Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
/// - Parameter arr: input array
/// - Returns: total weight of the MST
func minimumSpanningTreeBoruvka(_ arr: [Int]) -> Int {
    var idx = 0
    let n = arr[idx]; idx += 1
    let m = arr[idx]; idx += 1
    var eu = [Int](), ev = [Int](), ew = [Int]()
    for _ in 0..<m {
        eu.append(arr[idx]); idx += 1
        ev.append(arr[idx]); idx += 1
        ew.append(arr[idx]); idx += 1
    }

    var parent = Array(0..<n)
    var rank = Array(repeating: 0, count: n)

    func find(_ x: Int) -> Int {
        var v = x
        while parent[v] != v { parent[v] = parent[parent[v]]; v = parent[v] }
        return v
    }

    func unite(_ x: Int, _ y: Int) -> Bool {
        var rx = find(x), ry = find(y)
        if rx == ry { return false }
        if rank[rx] < rank[ry] { swap(&rx, &ry) }
        parent[ry] = rx
        if rank[rx] == rank[ry] { rank[rx] += 1 }
        return true
    }

    var totalWeight = 0
    var numComponents = n

    while numComponents > 1 {
        var cheapest = Array(repeating: -1, count: n)

        for i in 0..<m {
            let ru = find(eu[i]), rv = find(ev[i])
            if ru == rv { continue }
            if cheapest[ru] == -1 || ew[i] < ew[cheapest[ru]] { cheapest[ru] = i }
            if cheapest[rv] == -1 || ew[i] < ew[cheapest[rv]] { cheapest[rv] = i }
        }

        for node in 0..<n {
            if cheapest[node] != -1 {
                if unite(eu[cheapest[node]], ev[cheapest[node]]) {
                    totalWeight += ew[cheapest[node]]
                    numComponents -= 1
                }
            }
        }
    }

    return totalWeight
}

print(minimumSpanningTreeBoruvka([3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3]))
print(minimumSpanningTreeBoruvka([4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4]))
print(minimumSpanningTreeBoruvka([2, 1, 0, 1, 7]))
print(minimumSpanningTreeBoruvka([4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3]))
