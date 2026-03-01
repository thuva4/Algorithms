fun lz77Compression(arr: IntArray): Int {
    val n = arr.size; var count = 0; var i = 0
    while (i < n) {
        var bestLen = 0; val start = maxOf(0, i - 256)
        for (j in start until i) {
            var len = 0; val dist = i - j
            while (i+len < n && len < dist && arr[j+len] == arr[i+len]) len++
            if (len == dist) while (i+len < n && arr[j+(len%dist)] == arr[i+len]) len++
            if (len > bestLen) bestLen = len
        }
        if (bestLen >= 2) { count++; i += bestLen } else i++
    }
    return count
}

fun main() {
    println(lz77Compression(intArrayOf(1,2,3,1,2,3)))
    println(lz77Compression(intArrayOf(5,5,5,5)))
    println(lz77Compression(intArrayOf(1,2,3,4)))
    println(lz77Compression(intArrayOf(1,2,1,2,3,4,3,4)))
}
