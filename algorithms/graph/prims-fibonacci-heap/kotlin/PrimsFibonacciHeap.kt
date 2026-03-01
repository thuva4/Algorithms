import java.util.PriorityQueue

fun primsFibonacciHeap(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]
    val adj = Array(n) { mutableListOf<Pair<Int, Int>>() }
    for (i in 0 until m) {
        val u = arr[2+3*i]; val v = arr[2+3*i+1]; val w = arr[2+3*i+2]
        adj[u].add(Pair(w, v)); adj[v].add(Pair(w, u))
    }

    val inMst = BooleanArray(n)
    val key = IntArray(n) { Int.MAX_VALUE }
    key[0] = 0
    val pq = PriorityQueue<Pair<Int, Int>>(compareBy { it.first })
    pq.add(Pair(0, 0))
    var total = 0

    while (pq.isNotEmpty()) {
        val (w, u) = pq.poll()
        if (inMst[u]) continue
        inMst[u] = true; total += w
        for ((ew, v) in adj[u]) {
            if (!inMst[v] && ew < key[v]) { key[v] = ew; pq.add(Pair(ew, v)) }
        }
    }

    return total
}
