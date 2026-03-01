package astarsearch

import (
	"container/heap"
	"math"
)

type Node struct {
	id    int
	f, g  int
	index int
}

type PriorityQueue []*Node

func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].f < pq[j].f
}
func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
	pq[i].index = i
	pq[j].index = j
}
func (pq *PriorityQueue) Push(x interface{}) {
	n := len(*pq)
	item := x.(*Node)
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

type Edge struct {
	to     int
	weight int
}

func AStarSearch(arr []int) int {
	if len(arr) < 2 {
		return -1
	}

	n := arr[0]
	m := arr[1]

	if len(arr) < 2+3*m+2+n {
		return -1
	}

	start := arr[2+3*m]
	goal := arr[2+3*m+1]

	if start < 0 || start >= n || goal < 0 || goal >= n {
		return -1
	}
	if start == goal {
		return 0
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

	hIndex := 2 + 3*m + 2
	
	openSet := &PriorityQueue{}
	heap.Init(openSet)
	
	gScore := make([]int, n)
	for i := range gScore {
		gScore[i] = math.MaxInt32
	}

	gScore[start] = 0
	heap.Push(openSet, &Node{id: start, f: arr[hIndex+start], g: 0})

	for openSet.Len() > 0 {
		current := heap.Pop(openSet).(*Node)
		u := current.id

		if u == goal {
			return current.g
		}

		if current.g > gScore[u] {
			continue
		}

		for _, e := range adj[u] {
			v := e.to
			w := e.weight

			if gScore[u] != math.MaxInt32 && gScore[u]+w < gScore[v] {
				gScore[v] = gScore[u] + w
				f := gScore[v] + arr[hIndex+v]
				heap.Push(openSet, &Node{id: v, f: f, g: gScore[v]})
			}
		}
	}

	return -1
}
