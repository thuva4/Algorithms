package dijkstra

import (
	"container/heap"
)

const INF = 1000000000

type Edge struct {
	to     int
	weight int
}

type Item struct {
	u        int
	priority int
	index    int
}

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
	old[n-1] = nil
	item.index = -1
	*pq = old[0 : n-1]
	return item
}

func Dijkstra(arr []int) []int {
	if len(arr) < 2 {
		return []int{}
	}

	n := arr[0]
	m := arr[1]

	if len(arr) < 2+3*m+1 {
		return []int{}
	}

	start := arr[2+3*m]
	if start < 0 || start >= n {
		return []int{}
	}

	adj := make([][]Edge, n)
	for i := 0; i < m; i++ {
		u := arr[2+3*i]
		v := arr[2+3*i+1]
		w := arr[2+3*i+2]
		if u >= 0 && u < n && v >= 0 && v < n {
			adj[u] = append(adj[u], Edge{to: v, weight: w})
		}
	}

	dist := make([]int, n)
	for i := range dist {
		dist[i] = INF
	}
	dist[start] = 0

	pq := make(PriorityQueue, 0)
	heap.Init(&pq)
	heap.Push(&pq, &Item{u: start, priority: 0})

	for pq.Len() > 0 {
		item := heap.Pop(&pq).(*Item)
		u := item.u
		d := item.priority

		if d > dist[u] {
			continue
		}

		for _, e := range adj[u] {
			if dist[u]+e.weight < dist[e.to] {
				dist[e.to] = dist[u] + e.weight
				heap.Push(&pq, &Item{u: e.to, priority: dist[e.to]})
			}
		}
	}

	return dist
}
