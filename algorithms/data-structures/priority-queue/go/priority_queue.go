package priorityqueue

// PriorityQueueOps processes priority queue operations and returns sum of extracted values.
func PriorityQueueOps(arr []int) int {
	if len(arr) == 0 {
		return 0
	}

	heap := []int{}
	opCount := arr[0]
	idx := 1
	total := 0

	siftUp := func(i int) {
		for i > 0 {
			p := (i - 1) / 2
			if heap[i] < heap[p] {
				heap[i], heap[p] = heap[p], heap[i]
				i = p
			} else {
				break
			}
		}
	}

	siftDown := func(i int) {
		sz := len(heap)
		for {
			s, l, r := i, 2*i+1, 2*i+2
			if l < sz && heap[l] < heap[s] {
				s = l
			}
			if r < sz && heap[r] < heap[s] {
				s = r
			}
			if s != i {
				heap[i], heap[s] = heap[s], heap[i]
				i = s
			} else {
				break
			}
		}
	}

	for i := 0; i < opCount; i++ {
		t := arr[idx]
		v := arr[idx+1]
		idx += 2
		if t == 1 {
			heap = append(heap, v)
			siftUp(len(heap) - 1)
		} else if t == 2 {
			if len(heap) == 0 {
				continue
			}
			total += heap[0]
			heap[0] = heap[len(heap)-1]
			heap = heap[:len(heap)-1]
			if len(heap) > 0 {
				siftDown(0)
			}
		}
	}
	return total
}
