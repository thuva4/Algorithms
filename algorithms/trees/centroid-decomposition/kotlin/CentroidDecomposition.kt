lateinit var adj: Array<MutableList<Int>>
lateinit var removed: BooleanArray
lateinit var subSize: IntArray

fun getSubSize(v: Int, parent: Int) {
    subSize[v] = 1
    for (u in adj[v])
        if (u != parent && !removed[u]) { getSubSize(u, v); subSize[v] += subSize[u] }
}

fun getCentroid(v: Int, parent: Int, treeSize: Int): Int {
    for (u in adj[v])
        if (u != parent && !removed[u] && subSize[u] > treeSize / 2)
            return getCentroid(u, v, treeSize)
    return v
}

fun decompose(v: Int, depth: Int): Int {
    getSubSize(v, -1)
    val centroid = getCentroid(v, -1, subSize[v])
    removed[centroid] = true
    var maxDepth = depth
    for (u in adj[centroid])
        if (!removed[u]) { val r = decompose(u, depth + 1); if (r > maxDepth) maxDepth = r }
    removed[centroid] = false
    return maxDepth
}

fun centroidDecomposition(arr: IntArray): Int {
    var idx = 0
    val n = arr[idx++]
    if (n <= 1) return 0

    adj = Array(n) { mutableListOf() }
    val m = (arr.size - 1) / 2
    for (i in 0 until m) {
        val u = arr[idx++]; val v = arr[idx++]
        adj[u].add(v); adj[v].add(u)
    }
    removed = BooleanArray(n)
    subSize = IntArray(n)
    return decompose(0, 0)
}

fun main() {
    println(centroidDecomposition(intArrayOf(4, 0, 1, 1, 2, 2, 3)))
    println(centroidDecomposition(intArrayOf(5, 0, 1, 0, 2, 0, 3, 0, 4)))
    println(centroidDecomposition(intArrayOf(1)))
    println(centroidDecomposition(intArrayOf(7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6)))
}
