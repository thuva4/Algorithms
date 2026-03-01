package algorithms.searching.interpolationsearch

class InterpolationSearch {
    fun search(arr: IntArray, target: Int): Int {
        if (arr.isEmpty()) return -1
        
        var lo = 0
        var hi = arr.size - 1
        
        while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
            if (lo == hi) {
                if (arr[lo] == target) return lo
                return -1
            }
            
            if (arr[hi] == arr[lo]) {
                if (arr[lo] == target) return lo
                return -1
            }
            
            val pos = lo + (((hi - lo).toDouble() / (arr[hi] - arr[lo])) * (target - arr[lo])).toInt()
            
            if (arr[pos] == target)
                return pos
                
            if (arr[pos] < target)
                lo = pos + 1
            else
                hi = pos - 1
        }
        return -1
    }
}
