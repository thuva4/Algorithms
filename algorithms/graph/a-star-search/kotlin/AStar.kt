import java.util.PriorityQueue

fun aStarSearch(arr: IntArray): Int {
    if (arr.size < 2) return -1

    val n = arr[0]
    val m = arr[1]
    val headerSize = 2 + 3 * m
    if (arr.size < headerSize + 2 + n) return -1

    val start = arr[headerSize]
    val goal = arr[headerSize + 1]
    if (start !in 0 until n || goal !in 0 until n) return -1
    if (start == goal) return 0

    val adjacency = Array(n) { mutableListOf<Pair<Int, Int>>() }
    for (index in 0 until m) {
        val offset = 2 + 3 * index
        val from = arr[offset]
        val to = arr[offset + 1]
        val weight = arr[offset + 2]
        if (from in 0 until n && to in 0 until n) {
            adjacency[from].add(to to weight)
        }
    }

    val heuristicOffset = headerSize + 2
    val openSet = PriorityQueue(compareBy<Pair<Int, Int>> { it.first })
    val distance = IntArray(n) { Int.MAX_VALUE }

    distance[start] = 0
    openSet.add(arr[heuristicOffset + start] to start)

    while (openSet.isNotEmpty()) {
        val (_, node) = openSet.poll()
        if (node == goal) {
            return distance[node]
        }

        for ((next, weight) in adjacency[node]) {
            if (distance[node] == Int.MAX_VALUE) {
                continue
            }
            val candidate = distance[node] + weight
            if (candidate < distance[next]) {
                distance[next] = candidate
                val priority = candidate + arr[heuristicOffset + next]
                openSet.add(priority to next)
            }
        }
    }

    return -1
}

/**
 * A* search algorithm to find shortest path from start to goal.
 * Returns a pair of (path, cost).
 */
fun aStar(
    adjList: Map<Int, List<List<Int>>>,
    start: Int,
    goal: Int,
    heuristic: Map<Int, Int>
): Pair<List<Int>, Double> {
    if (start == goal) return Pair(listOf(start), 0.0)

    val gScore = mutableMapOf<Int, Double>()
    val cameFrom = mutableMapOf<Int, Int>()
    val closedSet = mutableSetOf<Int>()

    for (node in adjList.keys) {
        gScore[node] = Double.POSITIVE_INFINITY
    }
    gScore[start] = 0.0

    // Priority queue: Pair(fScore, node)
    val pq = PriorityQueue<Pair<Double, Int>>(compareBy { it.first })
    pq.add(Pair((heuristic[start] ?: 0).toDouble(), start))

    while (pq.isNotEmpty()) {
        val (_, currentNode) = pq.poll()

        if (currentNode == goal) {
            val path = mutableListOf<Int>()
            var node = goal
            while (cameFrom.containsKey(node)) {
                path.add(0, node)
                node = cameFrom[node]!!
            }
            path.add(0, node)
            return Pair(path, gScore[goal]!!)
        }

        if (currentNode in closedSet) continue
        closedSet.add(currentNode)

        for (edge in adjList[currentNode] ?: emptyList()) {
            val neighbor = edge[0]
            val weight = edge[1]

            if (neighbor in closedSet) continue

            val tentativeG = gScore[currentNode]!! + weight
            if (tentativeG < (gScore[neighbor] ?: Double.POSITIVE_INFINITY)) {
                cameFrom[neighbor] = currentNode
                gScore[neighbor] = tentativeG
                val fScore = tentativeG + (heuristic[neighbor] ?: 0)
                pq.add(Pair(fScore, neighbor))
            }
        }
    }

    return Pair(emptyList(), Double.POSITIVE_INFINITY)
}

fun main() {
    val adjList = mapOf(
        0 to listOf(listOf(1, 1), listOf(2, 4)),
        1 to listOf(listOf(2, 2), listOf(3, 6)),
        2 to listOf(listOf(3, 3)),
        3 to emptyList()
    )
    val heuristic = mapOf(0 to 5, 1 to 4, 2 to 2, 3 to 0)

    val (path, cost) = aStar(adjList, 0, 3, heuristic)
    println("Path: $path, Cost: $cost")
}
