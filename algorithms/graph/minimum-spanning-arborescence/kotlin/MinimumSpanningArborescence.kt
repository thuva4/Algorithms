fun minimumSpanningArborescence(arr: IntArray): Int {
    var n = arr[0]
    val m = arr[1]
    var root = arr[2]
    var eu = IntArray(m) { arr[3 + 3 * it] }
    var ev = IntArray(m) { arr[3 + 3 * it + 1] }
    var ew = IntArray(m) { arr[3 + 3 * it + 2] }

    val INF = Int.MAX_VALUE / 2
    var res = 0

    while (true) {
        val minIn = IntArray(n) { INF }
        val minEdge = IntArray(n) { -1 }

        for (i in eu.indices) {
            if (eu[i] != ev[i] && ev[i] != root && ew[i] < minIn[ev[i]]) {
                minIn[ev[i]] = ew[i]
                minEdge[ev[i]] = eu[i]
            }
        }

        for (i in 0 until n) {
            if (i != root && minIn[i] == INF) return -1
        }

        val comp = IntArray(n) { -1 }
        comp[root] = root
        var numCycles = 0

        for (i in 0 until n) {
            if (i != root) res += minIn[i]
        }

        val visited = IntArray(n) { -1 }
        for (i in 0 until n) {
            if (i == root) continue
            var v = i
            while (visited[v] == -1 && comp[v] == -1 && v != root) {
                visited[v] = i
                v = minEdge[v]
            }
            if (v != root && comp[v] == -1 && visited[v] == i) {
                var u = v
                do {
                    comp[u] = numCycles
                    u = minEdge[u]
                } while (u != v)
                numCycles++
            }
        }

        if (numCycles == 0) break

        for (i in 0 until n) {
            if (comp[i] == -1) comp[i] = numCycles++
        }

        val neu = mutableListOf<Int>()
        val nev = mutableListOf<Int>()
        val newW = mutableListOf<Int>()
        for (i in eu.indices) {
            val nu = comp[eu[i]]
            val nv = comp[ev[i]]
            if (nu != nv) {
                neu.add(nu)
                nev.add(nv)
                newW.add(ew[i] - minIn[ev[i]])
            }
        }

        eu = neu.toIntArray()
        ev = nev.toIntArray()
        ew = newW.toIntArray()
        root = comp[root]
        n = numCycles
    }

    return res
}
