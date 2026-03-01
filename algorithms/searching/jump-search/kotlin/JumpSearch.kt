package algorithms.searching.jumpsearch

import kotlin.math.sqrt
import kotlin.math.min

class JumpSearch {
    fun search(arr: IntArray, target: Int): Int {
        val n = arr.size
        if (n == 0) return -1
        
        var step = sqrt(n.toDouble()).toInt()
        var prev = 0
        
        while (arr[min(step, n) - 1] < target) {
            prev = step
            step += sqrt(n.toDouble()).toInt()
            if (prev >= n)
                return -1
        }
        
        while (arr[prev] < target) {
            prev++
            if (prev == min(step, n))
                return -1
        }
        
        if (arr[prev] == target)
            return prev
            
        return -1
    }
}
