package algorithms.sorting.strandsort

import java.util.LinkedList

class StrandSort {
    fun sort(arr: IntArray) {
        if (arr.size <= 1) return

        val list = LinkedList<Int>()
        for (i in arr) list.add(i)

        var sorted = LinkedList<Int>()

        while (list.isNotEmpty()) {
            val strand = LinkedList<Int>()
            strand.add(list.removeFirst())

            val it = list.iterator()
            while (it.hasNext()) {
                val value = it.next()
                if (value >= strand.last) {
                    strand.add(value)
                    it.remove()
                }
            }

            sorted = merge(sorted, strand)
        }

        for (i in arr.indices) {
            arr[i] = sorted[i]
        }
    }

    private fun merge(sorted: LinkedList<Int>, strand: LinkedList<Int>): LinkedList<Int> {
        val result = LinkedList<Int>()
        while (sorted.isNotEmpty() && strand.isNotEmpty()) {
            if (sorted.first <= strand.first) {
                result.add(sorted.removeFirst())
            } else {
                result.add(strand.removeFirst())
            }
        }
        result.addAll(sorted)
        result.addAll(strand)
        return result
    }
}
