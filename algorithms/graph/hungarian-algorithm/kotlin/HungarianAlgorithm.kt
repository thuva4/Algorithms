/**
 * Hungarian Algorithm - Solve the assignment problem in O(n^3).
 */
fun hungarian(cost: Array<IntArray>): Pair<IntArray, Int> {
    val n = cost.size
    val INF = Int.MAX_VALUE / 2

    val u = IntArray(n + 1)
    val v = IntArray(n + 1)
    val matchJob = IntArray(n + 1)

    for (i in 1..n) {
        matchJob[0] = i
        var j0 = 0
        val dist = IntArray(n + 1) { INF }
        val used = BooleanArray(n + 1)
        val prevJob = IntArray(n + 1)

        while (true) {
            used[j0] = true
            val w = matchJob[j0]
            var delta = INF
            var j1 = -1

            for (j in 1..n) {
                if (!used[j]) {
                    val cur = cost[w - 1][j - 1] - u[w] - v[j]
                    if (cur < dist[j]) {
                        dist[j] = cur
                        prevJob[j] = j0
                    }
                    if (dist[j] < delta) {
                        delta = dist[j]
                        j1 = j
                    }
                }
            }

            for (j in 0..n) {
                if (used[j]) {
                    u[matchJob[j]] += delta
                    v[j] -= delta
                } else {
                    dist[j] -= delta
                }
            }

            j0 = j1
            if (matchJob[j0] == 0) break
        }

        while (j0 != 0) {
            matchJob[j0] = matchJob[prevJob[j0]]
            j0 = prevJob[j0]
        }
    }

    val assignment = IntArray(n)
    for (j in 1..n) {
        assignment[matchJob[j] - 1] = j - 1
    }

    val totalCost = (0 until n).sumOf { cost[it][assignment[it]] }
    return Pair(assignment, totalCost)
}

fun main() {
    val cost = arrayOf(intArrayOf(9, 2, 7), intArrayOf(6, 4, 3), intArrayOf(5, 8, 1))
    val (assignment, totalCost) = hungarian(cost)
    println("Assignment: ${assignment.toList()}")
    println("Total cost: $totalCost")
}
