package algorithms.sorting.pigeonhole

/**
 * Pigeonhole Sort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 */
object PigeonholeSort {
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
        val holes = Array(range) { mutableListOf<Int>() }

        for (x in arr) {
            holes[x - min].add(x)
        }

        val result = IntArray(arr.size)
        var k = 0
        for (hole in holes) {
            for (x in hole) {
                result[k++] = x
            }
        }

        return result
    }
}
