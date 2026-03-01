package algorithms.sorting.bubble

/**
 * Bubble Sort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 */
object BubbleSort {
    fun sort(arr: IntArray): IntArray {
        if (arr.size <= 1) {
            return arr.copyOf()
        }

        // Create a copy of the input array to avoid modifying it
        val result = arr.copyOf()
        val n = result.size

        for (i in 0 until n - 1) {
            // Optimization: track if any swaps occurred in this pass
            var swapped = false

            // Last i elements are already in place, so we don't need to check them
            for (j in 0 until n - i - 1) {
                if (result[j] > result[j + 1]) {
                    // Swap elements if they are in the wrong order
                    val temp = result[j]
                    result[j] = result[j + 1]
                    result[j + 1] = temp
                    swapped = true
                }
            }

            // If no two elements were swapped by inner loop, then break
            if (!swapped) {
                break
            }
        }

        return result
    }
}
