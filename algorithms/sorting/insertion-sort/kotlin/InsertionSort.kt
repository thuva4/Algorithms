package algorithms.sorting.insertion

/**
 * Insertion Sort implementation.
 * Builds the final sorted array (or list) one item at a time.
 */
object InsertionSort {
    fun sort(arr: IntArray): IntArray {
        val result = arr.copyOf()
        val n = result.size

        for (i in 1 until n) {
            val key = result[i]
            var j = i - 1

            while (j >= 0 && result[j] > key) {
                result[j + 1] = result[j]
                j = j - 1
            }
            result[j + 1] = key
        }

        return result
    }
}
