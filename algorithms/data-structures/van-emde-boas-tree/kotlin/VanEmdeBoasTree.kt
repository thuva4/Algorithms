import java.util.TreeSet
import kotlin.math.ceil
import kotlin.math.sqrt

fun vanEmdeBoasTree(data: IntArray): IntArray {
    val u = data[0]
    val nOps = data[1]
    val set = TreeSet<Int>()
    val results = mutableListOf<Int>()
    var idx = 2
    for (i in 0 until nOps) {
        val op = data[idx]
        val v = data[idx + 1]
        idx += 2
        when (op) {
            1 -> set.add(v)
            2 -> results.add(if (set.contains(v)) 1 else 0)
            3 -> {
                val succ = set.higher(v)
                results.add(succ ?: -1)
            }
        }
    }
    return results.toIntArray()
}

fun main() {
    println(vanEmdeBoasTree(intArrayOf(16, 4, 1, 3, 1, 5, 2, 3, 2, 7)).toList())
    println(vanEmdeBoasTree(intArrayOf(16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9)).toList())
}
