package algorithms.sorting.partial

import java.util.PriorityQueue
import java.util.Collections

fun partialSort(arr: IntArray): IntArray {
    return PartialSort.sort(arr, arr.size)
}

/**
 * Partial Sort implementation.
 * Returns the smallest k elements of the array in sorted order.
 */
object PartialSort {
    fun sort(arr: IntArray, k: Int): IntArray {
        if (k <= 0) {
            return IntArray(0)
        }
        if (k >= arr.size) {
            val result = arr.copyOf()
            result.sort()
            return result
        }

        val maxHeap = PriorityQueue<Int>(Collections.reverseOrder())

        for (num in arr) {
            maxHeap.offer(num)
            if (maxHeap.size > k) {
                maxHeap.poll()
            }
        }

        val result = IntArray(k)
        for (i in k - 1 downTo 0) {
            result[i] = maxHeap.poll()
        }

        return result
    }
}
