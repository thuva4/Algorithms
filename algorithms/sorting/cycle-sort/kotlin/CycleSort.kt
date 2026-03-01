package algorithms.sorting.cycle

/**
 * Cycle Sort implementation.
 * An in-place, unstable sorting algorithm that is optimal in terms of
 * the number of writes to the original array.
 */
object CycleSort {
    fun sort(arr: IntArray): IntArray {
        val result = arr.copyOf()
        val n = result.size

        for (cycleStart in 0 until n - 1) {
            var item = result[cycleStart]

            var pos = cycleStart
            for (i in cycleStart + 1 until n) {
                if (result[i] < item) {
                    pos++
                }
            }

            if (pos == cycleStart) {
                continue
            }

            while (item == result[pos]) {
                pos++
            }

            if (pos != cycleStart) {
                val temp = item
                item = result[pos]
                result[pos] = temp
            }

            while (pos != cycleStart) {
                pos = cycleStart
                for (i in cycleStart + 1 until n) {
                    if (result[i] < item) {
                        pos++
                    }
                }

                while (item == result[pos]) {
                    pos++
                }

                if (item != result[pos]) {
                    val temp = item
                    item = result[pos]
                    result[pos] = temp
                }
            }
        }

        return result
    }
}
