package algorithms.sorting.counting

/**
 * Counting Sort implementation.
 * Efficient for sorting integers with a known small range.
 */
object CountingSort {
    fun sort(arr: IntArray): IntArray {
        if (arr.isEmpty()) {
            return IntArray(0)
        }

        var min = arr[0]
        var max = arr[0]

        for (i in 1 until arr.size) {
            if (arr[i] < min) min = arr[i]
            if (arr[i] > max) max = arr[i]
        }

        val range = max - min + 1
        val count = IntArray(range)
        val output = IntArray(arr.size)

        for (x in arr) {
            count[x - min]++
        }

        for (i in 1 until count.size) {
            count[i] += count[i - 1]
        }

        for (i in arr.size - 1 downTo 0) {
            output[count[arr[i] - min] - 1] = arr[i]
            count[arr[i] - min]--
        }

        return output
    }
}
