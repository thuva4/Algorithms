fun chromaticNumber(arr: IntArray): Int {
    val n = arr[0]
    val m = arr[1]
    if (n == 0) return 0
    if (m == 0) return 1

    val adj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until m) {
        val u = arr[2 + 2 * i]
        val v = arr[2 + 2 * i + 1]
        adj[u].add(v)
        adj[v].add(u)
    }

    fun isSafe(colors: IntArray, v: Int, c: Int): Boolean {
        for (u in adj[v]) {
            if (colors[u] == c) return false
        }
        return true
    }

    fun solve(colors: IntArray, v: Int, k: Int): Boolean {
        if (v == n) return true
        for (c in 1..k) {
            if (isSafe(colors, v, c)) {
                colors[v] = c
                if (solve(colors, v + 1, k)) return true
                colors[v] = 0
            }
        }
        return false
    }

    for (k in 1..n) {
        val colors = IntArray(n)
        if (solve(colors, 0, k)) return k
    }
    return n
}
