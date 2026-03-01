fun minimumCutStoerWagner(arr: IntArray): Int {
    val n = arr[0]
    val m = arr[1]
    val w = Array(n) { IntArray(n) }
    var idx = 2
    for (i in 0 until m) {
        val u = arr[idx]; val v = arr[idx + 1]; val c = arr[idx + 2]
        w[u][v] += c
        w[v][u] += c
        idx += 3
    }

    val merged = BooleanArray(n)
    var best = Int.MAX_VALUE

    for (phase in 0 until n - 1) {
        val key = IntArray(n)
        val inA = BooleanArray(n)
        var prev = -1
        var last = -1

        for (it in 0 until n - phase) {
            var sel = -1
            for (v in 0 until n) {
                if (!merged[v] && !inA[v]) {
                    if (sel == -1 || key[v] > key[sel]) {
                        sel = v
                    }
                }
            }
            inA[sel] = true
            prev = last
            last = sel
            for (v in 0 until n) {
                if (!merged[v] && !inA[v]) {
                    key[v] += w[sel][v]
                }
            }
        }

        if (key[last] < best) best = key[last]

        for (v in 0 until n) {
            w[prev][v] += w[last][v]
            w[v][prev] += w[v][last]
        }
        merged[last] = true
    }

    return best
}
