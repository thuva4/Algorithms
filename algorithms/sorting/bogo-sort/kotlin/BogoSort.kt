package algorithms.sorting.bogo

import java.util.Random

/**
 * Bogo Sort implementation.
 * Repeatedly shuffles the array until it's sorted.
 * WARNING: Highly inefficient for large arrays.
 */
object BogoSort {
    private val random = Random()

    fun sort(arr: IntArray): IntArray {
        if (arr.size <= 1) {
            return arr.copyOf()
        }

        val result = arr.copyOf()
        while (!isSorted(result)) {
            shuffle(result)
        }
        return result
    }

    private fun isSorted(arr: IntArray): Boolean {
        for (i in 0 until arr.size - 1) {
            if (arr[i] > arr[i + 1]) {
                return false
            }
        }
        return true
    }

    private fun shuffle(arr: IntArray) {
        for (i in arr.size - 1 downTo 1) {
            val j = random.nextInt(i + 1)
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
}
