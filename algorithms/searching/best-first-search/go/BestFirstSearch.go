package main

import "container/heap"

type Entry struct {
	node      int
	heuristic int
	path      []int
}

type MinHeap []Entry

func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i].heuristic < h[j].heuristic }
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(Entry)) }
func (h *MinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func BestFirstSearch(adj map[int][]int, start int, goal int, heuristic map[int]int) []int {
	if start == goal {
		return []int{start}
	}

	visited := make(map[int]bool)
	pq := &MinHeap{}
	heap.Init(pq)

	startPath := []int{start}
	heap.Push(pq, Entry{node: start, heuristic: heuristic[start], path: startPath})

	for pq.Len() > 0 {
		current := heap.Pop(pq).(Entry)

		if current.node == goal {
			return current.path
		}

		if visited[current.node] {
			continue
		}
		visited[current.node] = true

		for _, neighbor := range adj[current.node] {
			if !visited[neighbor] {
				newPath := make([]int, len(current.path)+1)
				copy(newPath, current.path)
				newPath[len(current.path)] = neighbor
				heap.Push(pq, Entry{node: neighbor, heuristic: heuristic[neighbor], path: newPath})
			}
		}
	}

	return []int{}
}

func main() {}
