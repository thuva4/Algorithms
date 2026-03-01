package algorithms.sorting.bucket

/**
 * Bucket Sort implementation.
 * Divides the input into several buckets, each of which is then sorted individually.
 */
object BucketSort {
    fun sort(arr: IntArray): IntArray {
        if (arr.size <= 1) {
            return arr.copyOf()
        }

        val n = arr.size
        var min = arr[0]
        var max = arr[0]

        for (i in 1 until n) {
            if (arr[i] < min) min = arr[i]
            if (arr[i] > max) max = arr[i]
        }

        if (min == max) {
            return arr.copyOf()
        }

        // Initialize buckets
        val buckets = Array(n) { mutableListOf<Int>() }
        val range = max.toLong() - min

        // Distribute elements into buckets
        for (x in arr) {
            val index = ((x.toLong() - min) * (n - 1) / range).toInt()
            buckets[index].add(x)
        }

        // Sort each bucket and merge
        val result = IntArray(n)
        var k = 0
        for (bucket in buckets) {
            if (bucket.isNotEmpty()) {
                bucket.sort()
                for (x in bucket) {
                    result[k++] = x
                }
            }
        }

        return result
    }
}
