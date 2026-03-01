package bestfirstsearch

import (
	"container/heap"
)

// Item is an element in the priority queue.
type Item struct {
	value    int // Node ID
	priority int // Heuristic value
	index    int // Index in the heap
}

// PriorityQueue implements heap.Interface and holds Items.
type PriorityQueue []*Item

func (pq PriorityQueue) Len() int { return len(pq) }

func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].priority < pq[j].priority
}

func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
	pq[i].index = i
	pq[j].index = j
}

func (pq *PriorityQueue) Push(x interface{}) {
	n := len(*pq)
	item := x.(*Item)
	item.index = n
	*pq = append(*pq, item)
}

func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil  // avoid memory leak
	item.index = -1 // for safety
	*pq = old[0 : n-1]
	return item
}

// BestFirstSearch finds a path from start to target using a greedy best-first strategy.
// n: number of nodes
// adj: adjacency list where adj[u] contains neighbors of u
// start: start node
// target: target node
// heuristic: map or slice of heuristic values
func BestFirstSearch(n int, adj [][]int, start, target int, heuristic []int) []int {
	pq := make(PriorityQueue, 0)
	heap.Init(&pq)

	visited := make([]bool, n)
	parent := make([]int, n)
	for i := range parent {
		parent[i] = -1
	}

	heap.Push(&pq, &Item{value: start, priority: heuristic[start]})
	visited[start] = true

	found := false

	for pq.Len() > 0 {
		item := heap.Pop(&pq).(*Item)
		u := item.value

		if u == target {
			found = true
			break
		}

		for _, v := range adj[u] {
			if !visited[v] {
				visited[v] = true
				parent[v] = u
				heap.Push(&pq, &Item{value: v, priority: heuristic[v]})
			}
		}
	}

	var path []int
	if found {
		curr := target
		for curr != -1 {
			path = append(path, curr)
			curr = parent[curr]
		}
		// Reverse path
		for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
			path[i], path[j] = path[j], path[i]
		}
	}
	return path
}
