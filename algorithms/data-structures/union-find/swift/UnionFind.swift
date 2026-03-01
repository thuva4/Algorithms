class UnionFind {
    private var parent: [Int]
    private var rank: [Int]

    init(_ n: Int) {
        parent = Array(0..<n)
        rank = Array(repeating: 0, count: n)
    }

    func find(_ x: Int) -> Int {
        if parent[x] != x {
            parent[x] = find(parent[x])
        }
        return parent[x]
    }

    func union(_ x: Int, _ y: Int) {
        var px = find(x)
        var py = find(y)
        if px == py { return }
        if rank[px] < rank[py] { swap(&px, &py) }
        parent[py] = px
        if rank[px] == rank[py] { rank[px] += 1 }
    }

    func connected(_ x: Int, _ y: Int) -> Bool {
        return find(x) == find(y)
    }
}

let uf = UnionFind(5)
uf.union(0, 1)
uf.union(1, 2)
print("0 and 2 connected: \(uf.connected(0, 2))")
print("0 and 3 connected: \(uf.connected(0, 3))")
