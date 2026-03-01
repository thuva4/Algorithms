/**
 * Kosaraju's algorithm to find strongly connected components.
 */
fun findSCCs(adjList: Map<Int, List<Int>>): List<List<Int>> {
    val numNodes = adjList.size
    val visited = mutableSetOf<Int>()
    val finishOrder = mutableListOf<Int>()

    fun dfs1(node: Int) {
        visited.add(node)
        for (neighbor in adjList[node] ?: emptyList()) {
            if (neighbor !in visited) {
                dfs1(neighbor)
            }
        }
        finishOrder.add(node)
    }

    for (i in 0 until numNodes) {
        if (i !in visited) dfs1(i)
    }

    // Build reverse graph
    val revAdj = mutableMapOf<Int, MutableList<Int>>()
    for (node in adjList.keys) revAdj[node] = mutableListOf()
    for ((node, neighbors) in adjList) {
        for (neighbor in neighbors) {
            revAdj.getOrPut(neighbor) { mutableListOf() }.add(node)
        }
    }

    // Second DFS pass on reversed graph
    visited.clear()
    val components = mutableListOf<List<Int>>()

    fun dfs2(node: Int, component: MutableList<Int>) {
        visited.add(node)
        component.add(node)
        for (neighbor in revAdj[node] ?: emptyList()) {
            if (neighbor !in visited) {
                dfs2(neighbor, component)
            }
        }
    }

    for (i in finishOrder.reversed()) {
        if (i !in visited) {
            val component = mutableListOf<Int>()
            dfs2(i, component)
            component.sort()
            components.add(component)
        }
    }

    return components.sortedBy { it.firstOrNull() ?: Int.MAX_VALUE }
}

fun main() {
    val adjList = mapOf(
        0 to listOf(1),
        1 to listOf(2),
        2 to listOf(0, 3),
        3 to listOf(4),
        4 to listOf(3)
    )

    val components = findSCCs(adjList)
    println("SCCs: $components")
}
