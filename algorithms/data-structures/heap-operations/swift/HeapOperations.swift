func heapSortViaExtract(_ arr: [Int]) -> [Int] {
    var heap: [Int] = []

    func siftUp(_ idx: Int) {
        var i = idx
        while i > 0 {
            let parent = (i - 1) / 2
            if heap[i] < heap[parent] {
                heap.swapAt(i, parent)
                i = parent
            } else { break }
        }
    }

    func siftDown(_ idx: Int, _ size: Int) {
        var i = idx
        while true {
            var smallest = i
            let left = 2 * i + 1, right = 2 * i + 2
            if left < size && heap[left] < heap[smallest] { smallest = left }
            if right < size && heap[right] < heap[smallest] { smallest = right }
            if smallest != i {
                heap.swapAt(i, smallest)
                i = smallest
            } else { break }
        }
    }

    for val in arr {
        heap.append(val)
        siftUp(heap.count - 1)
    }

    var result: [Int] = []
    while !heap.isEmpty {
        result.append(heap[0])
        heap[0] = heap[heap.count - 1]
        heap.removeLast()
        if !heap.isEmpty { siftDown(0, heap.count) }
    }
    return result
}
