package algorithms.sorting.comb

import kotlin.math.floor

/**
 * Comb Sort implementation.
 * Improves on Bubble Sort by using a gap larger than 1.
 * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
 */
object CombSort {
    fun sort(arr: IntArray): IntArray {
        val result = arr.copyOf()
        val n = result.size
        var gap = n
        var sorted = false
        val shrink = 1.3

        while (!sorted) {
            gap = floor(gap / shrink).toInt()
            if (gap <= 1) {
                gap = 1
                sorted = true
            }

            for (i in 0 until n - gap) {
                if (result[i] > result[i + gap]) {
                    val temp = result[i]
                    result[i] = result[i + gap]
                    result[i + gap] = temp
                    sorted = false
                }
            }
        }

        return result
    }
}
