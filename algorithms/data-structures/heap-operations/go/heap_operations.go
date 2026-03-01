package heapoperations

// HeapSortViaExtract builds a min-heap and extracts all elements in sorted order.
func HeapSortViaExtract(arr []int) []int {
	heap := make([]int, 0, len(arr))

	siftUp := func(i int) {
		for i > 0 {
			parent := (i - 1) / 2
			if heap[i] < heap[parent] {
				heap[i], heap[parent] = heap[parent], heap[i]
				i = parent
			} else {
				break
			}
		}
	}

	siftDown := func(i, size int) {
		for {
			smallest := i
			left, right := 2*i+1, 2*i+2
			if left < size && heap[left] < heap[smallest] {
				smallest = left
			}
			if right < size && heap[right] < heap[smallest] {
				smallest = right
			}
			if smallest != i {
				heap[i], heap[smallest] = heap[smallest], heap[i]
				i = smallest
			} else {
				break
			}
		}
	}

	for _, val := range arr {
		heap = append(heap, val)
		siftUp(len(heap) - 1)
	}

	result := make([]int, 0, len(arr))
	for len(heap) > 0 {
		result = append(result, heap[0])
		heap[0] = heap[len(heap)-1]
		heap = heap[:len(heap)-1]
		if len(heap) > 0 {
			siftDown(0, len(heap))
		}
	}

	return result
}
