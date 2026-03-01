package spfa

import "math"

func Spfa(arr []int) int {
	n := arr[0]
	m := arr[1]
	src := arr[2]
	type edge struct{ to, w int }
	adj := make([][]edge, n)
	for i := 0; i < n; i++ {
		adj[i] = []edge{}
	}
	for i := 0; i < m; i++ {
		u := arr[3+3*i]
		v := arr[3+3*i+1]
		w := arr[3+3*i+2]
		adj[u] = append(adj[u], edge{v, w})
	}

	INF := math.MaxInt32 / 2
	dist := make([]int, n)
	for i := range dist {
		dist[i] = INF
	}
	dist[src] = 0
	inQueue := make([]bool, n)
	queue := []int{src}
	inQueue[src] = true

	for len(queue) > 0 {
		u := queue[0]
		queue = queue[1:]
		inQueue[u] = false
		for _, e := range adj[u] {
			if dist[u]+e.w < dist[e.to] {
				dist[e.to] = dist[u] + e.w
				if !inQueue[e.to] {
					queue = append(queue, e.to)
					inQueue[e.to] = true
				}
			}
		}
	}

	if dist[n-1] == INF {
		return -1
	}
	return dist[n-1]
}
