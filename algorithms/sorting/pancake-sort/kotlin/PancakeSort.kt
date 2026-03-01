package algorithms.sorting.pancake

/**
 * Pancake Sort implementation.
 * Sorts the array by repeatedly flipping subarrays.
 */
object PancakeSort {
    fun sort(arr: IntArray): IntArray {
        val result = arr.copyOf()
        val n = result.size

        for (currSize in n downTo 2) {
            val mi = findMax(result, currSize)

            if (mi != currSize - 1) {
                flip(result, mi)
                flip(result, currSize - 1)
            }
        }

        return result
    }

    private fun flip(arr: IntArray, k: Int) {
        var i = 0
        var j = k
        while (i < j) {
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            i++
            j--
        }
    }

    private fun findMax(arr: IntArray, n: Int): Int {
        var mi = 0
        for (i in 0 until n) {
            if (arr[i] > arr[mi]) {
                mi = i
            }
        }
        return mi
    }
}
