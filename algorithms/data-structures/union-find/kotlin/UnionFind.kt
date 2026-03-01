class UnionFind(n: Int) {
    private val parent = IntArray(n) { it }
    private val rank = IntArray(n)

    fun find(x: Int): Int {
        if (parent[x] != x)
            parent[x] = find(parent[x])
        return parent[x]
    }

    fun union(x: Int, y: Int) {
        var px = find(x)
        var py = find(y)
        if (px == py) return
        if (rank[px] < rank[py]) { val tmp = px; px = py; py = tmp }
        parent[py] = px
        if (rank[px] == rank[py]) rank[px]++
    }

    fun connected(x: Int, y: Int): Boolean {
        return find(x) == find(y)
    }
}

data class UnionFindOperation(val type: String, val a: Int, val b: Int)

fun unionFindOperations(n: Int, operations: List<UnionFindOperation>): BooleanArray {
    val uf = UnionFind(n)
    val results = mutableListOf<Boolean>()

    for (operation in operations) {
        when (operation.type) {
            "union" -> uf.union(operation.a, operation.b)
            "find" -> results.add(uf.connected(operation.a, operation.b))
        }
    }

    return results.toBooleanArray()
}

fun main() {
    val uf = UnionFind(5)
    uf.union(0, 1)
    uf.union(1, 2)
    println("0 and 2 connected: ${uf.connected(0, 2)}")
    println("0 and 3 connected: ${uf.connected(0, 3)}")
}
