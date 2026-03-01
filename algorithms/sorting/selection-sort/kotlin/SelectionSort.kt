package algorithms.sorting.selectionsort

class SelectionSort {
    fun sort(arr: IntArray) {
        val n = arr.size
        for (i in 0 until n - 1) {
            var min_idx = i
            for (j in i + 1 until n) {
                if (arr[j] < arr[min_idx])
                    min_idx = j
            }
            
            val temp = arr[min_idx]
            arr[min_idx] = arr[i]
            arr[i] = temp
        }
    }
}
