import java.util.PriorityQueue

fun huffmanCoding(frequencies: IntArray): Int {
    if (frequencies.size <= 1) {
        return 0
    }

    val minHeap = PriorityQueue<Int>()
    for (freq in frequencies) {
        minHeap.add(freq)
    }

    var totalCost = 0
    while (minHeap.size > 1) {
        val left = minHeap.poll()
        val right = minHeap.poll()
        val merged = left + right
        totalCost += merged
        minHeap.add(merged)
    }

    return totalCost
}
