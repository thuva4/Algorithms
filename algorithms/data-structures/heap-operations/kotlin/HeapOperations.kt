fun heapSortViaExtract(arr: IntArray): IntArray {
    val heap = mutableListOf<Int>()

    fun siftUp(idx: Int) {
        var i = idx
        while (i > 0) {
            val parent = (i - 1) / 2
            if (heap[i] < heap[parent]) {
                val tmp = heap[i]; heap[i] = heap[parent]; heap[parent] = tmp
                i = parent
            } else break
        }
    }

    fun siftDown(idx: Int, size: Int) {
        var i = idx
        while (true) {
            var smallest = i
            val left = 2 * i + 1; val right = 2 * i + 2
            if (left < size && heap[left] < heap[smallest]) smallest = left
            if (right < size && heap[right] < heap[smallest]) smallest = right
            if (smallest != i) {
                val tmp = heap[i]; heap[i] = heap[smallest]; heap[smallest] = tmp
                i = smallest
            } else break
        }
    }

    for (v in arr) {
        heap.add(v)
        siftUp(heap.size - 1)
    }

    val result = mutableListOf<Int>()
    while (heap.isNotEmpty()) {
        result.add(heap[0])
        heap[0] = heap[heap.size - 1]
        heap.removeAt(heap.size - 1)
        if (heap.isNotEmpty()) siftDown(0, heap.size)
    }
    return result.toIntArray()
}
