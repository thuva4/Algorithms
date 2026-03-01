package algorithms.searching.exponentialsearch

import kotlin.math.min

class ExponentialSearch {
    fun search(arr: IntArray, target: Int): Int {
        if (arr.isEmpty()) return -1
        if (arr[0] == target) return 0
        
        val n = arr.size
        var i = 1
        while (i < n && arr[i] <= target)
            i *= 2
            
        return binarySearch(arr, i / 2, min(i, n) - 1, target)
    }
    
    private fun binarySearch(arr: IntArray, l: Int, r: Int, target: Int): Int {
        var left = l
        var right = r
        while (left <= right) {
            val mid = left + (right - left) / 2
            if (arr[mid] == target)
                return mid
            if (arr[mid] < target)
                left = mid + 1
            else
                right = mid - 1
        }
        return -1
    }
}
