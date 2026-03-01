import kotlin.math.ln
import kotlin.math.max
import kotlin.math.min

fun minimax(depth: Int, nodeIndex: Int, isMax: Boolean, scores: IntArray, h: Int): Int {
    if (depth == h) return scores[nodeIndex]

    return if (isMax)
        max(minimax(depth + 1, nodeIndex * 2, false, scores, h),
            minimax(depth + 1, nodeIndex * 2 + 1, false, scores, h))
    else
        min(minimax(depth + 1, nodeIndex * 2, true, scores, h),
            minimax(depth + 1, nodeIndex * 2 + 1, true, scores, h))
}

fun main() {
    val scores = intArrayOf(3, 5, 2, 9, 12, 5, 23, 23)
    val h = (ln(scores.size.toDouble()) / ln(2.0)).toInt()
    val result = minimax(0, 0, true, scores, h)
    println("The optimal value is: $result")
}
