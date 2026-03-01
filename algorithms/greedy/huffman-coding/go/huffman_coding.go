package huffmancoding

import "container/heap"

type intHeap []int

func (h intHeap) Len() int           { return len(h) }
func (h intHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h intHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *intHeap) Push(x interface{}) {
	*h = append(*h, x.(int))
}

func (h *intHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

// HuffmanCoding computes the total weighted path length (total bits needed)
// for a Huffman encoding given character frequencies.
func HuffmanCoding(frequencies []int) int {
	if len(frequencies) <= 1 {
		return 0
	}

	h := &intHeap{}
	for _, freq := range frequencies {
		*h = append(*h, freq)
	}
	heap.Init(h)

	totalCost := 0
	for h.Len() > 1 {
		left := heap.Pop(h).(int)
		right := heap.Pop(h).(int)
		merged := left + right
		totalCost += merged
		heap.Push(h, merged)
	}

	return totalCost
}
