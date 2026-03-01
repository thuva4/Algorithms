fun planarityTesting(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]
    val edges = mutableSetOf<Long>()
    for (i in 0 until m) {
        val u = arr[2+2*i]; val v = arr[2+2*i+1]
        if (u != v) {
            val a = minOf(u, v); val b = maxOf(u, v)
            edges.add(a.toLong() * n + b)
        }
    }
    val e = edges.size
    if (n < 3) return 1
    return if (e <= 3 * n - 6) 1 else 0
}
