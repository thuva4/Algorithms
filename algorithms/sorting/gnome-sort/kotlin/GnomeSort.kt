package algorithms.sorting.gnome

/**
 * Gnome Sort implementation.
 * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
 * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
 */
object GnomeSort {
    fun sort(arr: IntArray): IntArray {
        val result = arr.copyOf()
        val n = result.size
        var index = 0

        while (index < n) {
            if (index == 0) {
                index++
                continue
            }
            if (result[index] >= result[index - 1]) {
                index++
            } else {
                val temp = result[index]
                result[index] = result[index - 1]
                result[index - 1] = temp
                index--
            }
        }

        return result
    }
}
