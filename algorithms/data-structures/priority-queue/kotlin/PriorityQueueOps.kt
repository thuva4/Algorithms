fun priorityQueueOps(arr: IntArray): Int {
    if (arr.isEmpty()) return 0
    val heap = mutableListOf<Int>()
    val opCount = arr[0]
    var idx = 1
    var total = 0

    fun siftUp(idx: Int) {
        var i = idx
        while (i > 0) { val p = (i-1)/2; if (heap[i] < heap[p]) { val t = heap[i]; heap[i] = heap[p]; heap[p] = t; i = p } else break }
    }
    fun siftDown(idx: Int) {
        var i = idx
        while (true) { var s = i; val l = 2*i+1; val r = 2*i+2
            if (l < heap.size && heap[l] < heap[s]) s = l
            if (r < heap.size && heap[r] < heap[s]) s = r
            if (s != i) { val t = heap[i]; heap[i] = heap[s]; heap[s] = t; i = s } else break }
    }

    for (i in 0 until opCount) {
        val type = arr[idx]; val v = arr[idx+1]; idx += 2
        if (type == 1) { heap.add(v); siftUp(heap.size - 1) }
        else if (type == 2) {
            if (heap.isEmpty()) continue
            total += heap[0]; heap[0] = heap[heap.size-1]; heap.removeAt(heap.size-1)
            if (heap.isNotEmpty()) siftDown(0)
        }
    }
    return total
}
