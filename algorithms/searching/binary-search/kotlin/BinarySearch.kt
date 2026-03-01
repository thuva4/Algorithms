package algorithms.searching.binarysearch

class BinarySearch {
    fun search(arr: IntArray, target: Int): Int {
        var left = 0
        var right = arr.size - 1
        
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
