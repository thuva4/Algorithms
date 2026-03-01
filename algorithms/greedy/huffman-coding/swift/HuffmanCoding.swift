func huffmanCoding(_ frequencies: [Int]) -> Int {
    if frequencies.count <= 1 {
        return 0
    }

    var heap = frequencies.sorted()

    var totalCost = 0
    while heap.count > 1 {
        let left = heap.removeFirst()
        let right = heap.removeFirst()
        let merged = left + right
        totalCost += merged

        var insertIndex = 0
        while insertIndex < heap.count && heap[insertIndex] < merged {
            insertIndex += 1
        }
        heap.insert(merged, at: insertIndex)
    }

    return totalCost
}
