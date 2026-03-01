import kotlin.math.ln
import kotlin.math.max
import kotlin.math.min

fun minimaxAB(depth: Int, nodeIndex: Int, isMax: Boolean, scores: IntArray, h: Int, alpha: Int, beta: Int): Int {
    if (depth == h) return scores[nodeIndex]

    var a = alpha
    var b = beta

    if (isMax) {
        var bestVal = Int.MIN_VALUE
        for (childIndex in intArrayOf(nodeIndex * 2, nodeIndex * 2 + 1)) {
            val childValue = minimaxAB(depth + 1, childIndex, false, scores, h, a, b)
            bestVal = max(bestVal, childValue)
            a = max(a, bestVal)
            if (b <= a) break
        }
        return bestVal
    } else {
        var bestVal = Int.MAX_VALUE
        for (childIndex in intArrayOf(nodeIndex * 2, nodeIndex * 2 + 1)) {
            val childValue = minimaxAB(depth + 1, childIndex, true, scores, h, a, b)
            bestVal = min(bestVal, childValue)
            b = min(b, bestVal)
            if (b <= a) break
        }
        return bestVal
    }
}

fun main() {
    val scores = intArrayOf(3, 5, 2, 9, 12, 5, 23, 23)
    val h = (ln(scores.size.toDouble()) / ln(2.0)).toInt()
    val result = minimaxAB(0, 0, true, scores, h, Int.MIN_VALUE, Int.MAX_VALUE)
    println("The optimal value is: $result")
}
