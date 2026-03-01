package algorithms.sorting.bitonic

/**
 * Bitonic Sort implementation.
 * Works on any array size by padding to the nearest power of 2.
 */
object BitonicSort {
    fun sort(arr: IntArray): IntArray {
        if (arr.isEmpty()) {
            return intArrayOf()
        }

        val n = arr.size
        var nextPow2 = 1
        while (nextPow2 < n) {
            nextPow2 *= 2
        }

        // Pad the array to the next power of 2
        // We use Int.MAX_VALUE for padding to handle ascending sort
        val padded = IntArray(nextPow2) { Int.MAX_VALUE }
        System.arraycopy(arr, 0, padded, 0, n)

        bitonicSortRecursive(padded, 0, nextPow2, true)

        // Return the first n elements (trimmed back to original size)
        return padded.copyOf(n)
    }

    private fun compareAndSwap(arr: IntArray, i: Int, j: Int, ascending: Boolean) {
        if ((ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j])) {
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }

    private fun bitonicMerge(arr: IntArray, low: Int, cnt: Int, ascending: Boolean) {
        if (cnt > 1) {
            val k = cnt / 2
            for (i in low until low + k) {
                compareAndSwap(arr, i, i + k, ascending)
            }
            bitonicMerge(arr, low, k, ascending)
            bitonicMerge(arr, low + k, k, ascending)
        }
    }

    private fun bitonicSortRecursive(arr: IntArray, low: Int, cnt: Int, ascending: Boolean) {
        if (cnt > 1) {
            val k = cnt / 2
            // Sort first half in ascending order
            bitonicSortRecursive(arr, low, k, true)
            // Sort second half in descending order
            bitonicSortRecursive(arr, low + k, k, false)
            // Merge the whole sequence in given order
            bitonicMerge(arr, low, cnt, ascending)
        }
    }
}
