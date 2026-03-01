package prufercode

import "container/heap"

type minHeap []int

func (h minHeap) Len() int           { return len(h) }
func (h minHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h minHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x interface{}) {
	*h = append(*h, x.(int))
}
func (h *minHeap) Pop() interface{} {
	old := *h
	last := old[len(old)-1]
	*h = old[:len(old)-1]
	return last
}

func prufer_encode(n int, edges [][]int) []int {
	if n <= 2 {
		return []int{}
	}

	adj := make([][]int, n)
	degree := make([]int, n)
	for _, edge := range edges {
		if len(edge) < 2 {
			continue
		}
		u := edge[0]
		v := edge[1]
		if u < 0 || v < 0 || u >= n || v >= n {
			continue
		}
		adj[u] = append(adj[u], v)
		adj[v] = append(adj[v], u)
		degree[u]++
		degree[v]++
	}

	leaves := &minHeap{}
	for node, deg := range degree {
		if deg == 1 {
			heap.Push(leaves, node)
		}
	}

	result := make([]int, 0, n-2)
	for len(result) < n-2 && leaves.Len() > 0 {
		leaf := heap.Pop(leaves).(int)
		parent := -1
		for _, next := range adj[leaf] {
			if degree[next] > 0 {
				parent = next
				break
			}
		}
		if parent == -1 {
			break
		}
		result = append(result, parent)
		degree[leaf] = 0
		degree[parent]--
		if degree[parent] == 1 {
			heap.Push(leaves, parent)
		}
	}

	return result
}
