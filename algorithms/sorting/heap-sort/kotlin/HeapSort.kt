package algorithms.sorting.heap

/**
 * Heap Sort implementation.
 * Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
 */
object HeapSort {
    fun sort(arr: IntArray): IntArray {
        val result = arr.copyOf()
        val n = result.size

        // Build max heap
        for (i in n / 2 - 1 downTo 0) {
            heapify(result, n, i)
        }

        // Extract elements
        for (i in n - 1 downTo 1) {
            val temp = result[0]
            result[0] = result[i]
            result[i] = temp

            heapify(result, i, 0)
        }

        return result
    }

    private fun heapify(arr: IntArray, n: Int, i: Int) {
        var largest = i
        val l = 2 * i + 1
        val r = 2 * i + 2

        if (l < n && arr[l] > arr[largest]) {
            largest = l
        }

        if (r < n && arr[r] > arr[largest]) {
            largest = r
        }

        if (largest != i) {
            val temp = arr[i]
            arr[i] = arr[largest]
            arr[largest] = temp

            heapify(arr, n, largest)
        }
    }
}
