package primsfibonacciheap

import "container/heap"

type item struct{ w, v int }
type minHeap []item
func (h minHeap) Len() int            { return len(h) }
func (h minHeap) Less(i, j int) bool   { return h[i].w < h[j].w }
func (h minHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x interface{})  { *h = append(*h, x.(item)) }
func (h *minHeap) Pop() interface{} {
	old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x
}

func PrimsFibonacciHeap(arr []int) int {
	n := arr[0]; m := arr[1]
	type edge struct{ w, v int }
	adj := make([][]edge, n)
	for i := 0; i < n; i++ { adj[i] = []edge{} }
	for i := 0; i < m; i++ {
		u, v, w := arr[2+3*i], arr[2+3*i+1], arr[2+3*i+2]
		adj[u] = append(adj[u], edge{w, v})
		adj[v] = append(adj[v], edge{w, u})
	}

	INF := 1<<31 - 1
	inMst := make([]bool, n)
	key := make([]int, n)
	for i := range key { key[i] = INF }
	key[0] = 0
	h := &minHeap{item{0, 0}}
	heap.Init(h)
	total := 0

	for h.Len() > 0 {
		top := heap.Pop(h).(item)
		u := top.v
		if inMst[u] { continue }
		inMst[u] = true
		total += top.w
		for _, e := range adj[u] {
			if !inMst[e.v] && e.w < key[e.v] {
				key[e.v] = e.w
				heap.Push(h, item{e.w, e.v})
			}
		}
	}

	return total
}
