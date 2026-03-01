package algorithms.sorting.radixsort

import kotlin.math.abs

class RadixSort {
    fun sort(arr: IntArray) {
        if (arr.isEmpty()) return
        
        val min = arr.minOrNull() ?: return
        var offset = 0
        
        if (min < 0) {
            offset = abs(min)
            for (i in arr.indices) {
                arr[i] += offset
            }
        }
        
        val max = arr.maxOrNull() ?: return
        
        var exp = 1
        while (max / exp > 0) {
            countSort(arr, exp)
            exp *= 10
        }
        
        if (offset > 0) {
            for (i in arr.indices) {
                arr[i] -= offset
            }
        }
    }

    private fun countSort(arr: IntArray, exp: Int) {
        val n = arr.size
        val output = IntArray(n)
        val count = IntArray(10)
        
        for (i in 0 until n)
            count[(arr[i] / exp) % 10]++
            
        for (i in 1 until 10)
            count[i] += count[i - 1]
            
        for (i in n - 1 downTo 0) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i]
            count[(arr[i] / exp) % 10]--
        }
        
        for (i in 0 until n)
            arr[i] = output[i]
    }
}
