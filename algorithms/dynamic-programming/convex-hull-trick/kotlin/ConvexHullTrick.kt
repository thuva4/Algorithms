fun convexHullTrick(n: Int, linesInput: Array<IntArray>, queries: IntArray): List<Long> {
    val lines = mutableListOf<Pair<Long, Long>>()
    for (index in 0 until minOf(n, linesInput.size)) {
        val line = linesInput[index]
        if (line.size >= 2) {
            lines.add(line[0].toLong() to line[1].toLong())
        }
    }
    return convexHullTrick(lines, queries.map { it.toLong() })
}

fun convexHullTrick(lines: MutableList<Pair<Long, Long>>, queries: List<Long>): List<Long> {
    return queries.map { x ->
        lines.minOfOrNull { (m, b) -> m * x + b } ?: 0L
    }
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toLong() }
    var idx = 0
    val n = input[idx++].toInt()
    val lines = mutableListOf<Pair<Long, Long>>()
    for (i in 0 until n) {
        val m = input[idx++]
        val b = input[idx++]
        lines.add(Pair(m, b))
    }
    val q = input[idx++].toInt()
    val queries = (0 until q).map { input[idx++] }
    println(convexHullTrick(lines, queries).joinToString(" "))
}
