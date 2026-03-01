/**
 * Find the minimum spanning tree using Boruvka's algorithm.
 *
 * Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
 * @param arr input array
 * @return total weight of the MST
 */
fun minimumSpanningTreeBoruvka(arr: IntArray): Int {
    var idx = 0
    val n = arr[idx++]
    val m = arr[idx++]
    val eu = IntArray(m)
    val ev = IntArray(m)
    val ew = IntArray(m)
    for (i in 0 until m) {
        eu[i] = arr[idx++]
        ev[i] = arr[idx++]
        ew[i] = arr[idx++]
    }

    val parent = IntArray(n) { it }
    val rank = IntArray(n)

    fun find(x: Int): Int {
        var v = x
        while (parent[v] != v) { parent[v] = parent[parent[v]]; v = parent[v] }
        return v
    }

    fun unite(x: Int, y: Int): Boolean {
        var rx = find(x); var ry = find(y)
        if (rx == ry) return false
        if (rank[rx] < rank[ry]) { val t = rx; rx = ry; ry = t }
        parent[ry] = rx
        if (rank[rx] == rank[ry]) rank[rx]++
        return true
    }

    var totalWeight = 0
    var numComponents = n

    while (numComponents > 1) {
        val cheapest = IntArray(n) { -1 }

        for (i in 0 until m) {
            val ru = find(eu[i]); val rv = find(ev[i])
            if (ru == rv) continue
            if (cheapest[ru] == -1 || ew[i] < ew[cheapest[ru]]) cheapest[ru] = i
            if (cheapest[rv] == -1 || ew[i] < ew[cheapest[rv]]) cheapest[rv] = i
        }

        for (node in 0 until n) {
            if (cheapest[node] != -1) {
                if (unite(eu[cheapest[node]], ev[cheapest[node]])) {
                    totalWeight += ew[cheapest[node]]
                    numComponents--
                }
            }
        }
    }

    return totalWeight
}

fun main() {
    println(minimumSpanningTreeBoruvka(intArrayOf(3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3)))
    println(minimumSpanningTreeBoruvka(intArrayOf(4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4)))
    println(minimumSpanningTreeBoruvka(intArrayOf(2, 1, 0, 1, 7)))
    println(minimumSpanningTreeBoruvka(intArrayOf(4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3)))
}
