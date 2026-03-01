package algorithms.sorting.timsort

import kotlin.math.min

class TimSort {
    private val RUN = 32

    fun sort(arr: IntArray) {
        val n = arr.size
        for (i in 0 until n step RUN) {
            insertionSort(arr, i, min((i + RUN - 1), (n - 1)))
        }

        var size = RUN
        while (size < n) {
            for (left in 0 until n step 2 * size) {
                val mid = left + size - 1
                val right = min((left + 2 * size - 1), (n - 1))

                if (mid < right) {
                    merge(arr, left, mid, right)
                }
            }
            size *= 2
        }
    }

    private fun insertionSort(arr: IntArray, left: Int, right: Int) {
        for (i in left + 1..right) {
            val temp = arr[i]
            var j = i - 1
            while (j >= left && arr[j] > temp) {
                arr[j + 1] = arr[j]
                j--
            }
            arr[j + 1] = temp
        }
    }

    private fun merge(arr: IntArray, l: Int, m: Int, r: Int) {
        val len1 = m - l + 1
        val len2 = r - m
        val left = IntArray(len1)
        val right = IntArray(len2)

        for (x in 0 until len1) {
            left[x] = arr[l + x]
        }
        for (x in 0 until len2) {
            right[x] = arr[m + 1 + x]
        }

        var i = 0
        var j = 0
        var k = l

        while (i < len1 && j < len2) {
            if (left[i] <= right[j]) {
                arr[k] = left[i]
                i++
            } else {
                arr[k] = right[j]
                j++
            }
            k++
        }

        while (i < len1) {
            arr[k] = left[i]
            k++
            i++
        }

        while (j < len2) {
            arr[k] = right[j]
            k++
            j++
        }
    }
}
