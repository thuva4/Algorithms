package main

import (
	"fmt"
	"math"
)

// ShortestPathDag finds the shortest path from src to n-1 in a DAG.
// Input format: [n, m, src, u1, v1, w1, ...]
// Returns: shortest distance or -1 if unreachable
func ShortestPathDag(arr []int) int {
	idx := 0
	n := arr[idx]; idx++
	m := arr[idx]; idx++
	src := arr[idx]; idx++

	type Edge struct{ to, w int }
	adj := make([][]Edge, n)
	inDegree := make([]int, n)
	for i := 0; i < m; i++ {
		u := arr[idx]; idx++
		v := arr[idx]; idx++
		w := arr[idx]; idx++
		adj[u] = append(adj[u], Edge{v, w})
		inDegree[v]++
	}

	queue := []int{}
	for i := 0; i < n; i++ {
		if inDegree[i] == 0 { queue = append(queue, i) }
	}

	topoOrder := []int{}
	for len(queue) > 0 {
		node := queue[0]; queue = queue[1:]
		topoOrder = append(topoOrder, node)
		for _, e := range adj[node] {
			inDegree[e.to]--
			if inDegree[e.to] == 0 { queue = append(queue, e.to) }
		}
	}

	dist := make([]int, n)
	for i := range dist { dist[i] = math.MaxInt32 }
	dist[src] = 0

	for _, u := range topoOrder {
		if dist[u] == math.MaxInt32 { continue }
		for _, e := range adj[u] {
			if dist[u]+e.w < dist[e.to] { dist[e.to] = dist[u] + e.w }
		}
	}

	if dist[n-1] == math.MaxInt32 { return -1 }
	return dist[n-1]
}

func main() {
	fmt.Println(ShortestPathDag([]int{4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7}))
	fmt.Println(ShortestPathDag([]int{3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1}))
	fmt.Println(ShortestPathDag([]int{2, 1, 0, 0, 1, 10}))
	fmt.Println(ShortestPathDag([]int{3, 1, 0, 1, 2, 5}))
}
