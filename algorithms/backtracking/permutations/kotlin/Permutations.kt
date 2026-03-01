fun permutations(arr: List<Int>): List<List<Int>> {
    val result = mutableListOf<List<Int>>()
    if (arr.isEmpty()) {
        result.add(emptyList())
        return result
    }

    fun backtrack(current: MutableList<Int>, remaining: MutableList<Int>) {
        if (remaining.isEmpty()) {
            result.add(current.toList())
            return
        }
        for (i in remaining.indices) {
            val elem = remaining[i]
            current.add(elem)
            remaining.removeAt(i)
            backtrack(current, remaining)
            remaining.add(i, elem)
            current.removeAt(current.size - 1)
        }
    }

    backtrack(mutableListOf(), arr.toMutableList())
    result.sortWith(compareBy<List<Int>> { it.getOrElse(0) { 0 } }
        .thenBy { it.getOrElse(1) { 0 } }
        .thenBy { it.getOrElse(2) { 0 } })
    return result
}

fun main() {
    val result = permutations(listOf(1, 2, 3))
    for (perm in result) {
        println(perm)
    }
}
