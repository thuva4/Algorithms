package bellmanford

const INF = 1000000000

func BellmanFord(arr []int) []int {
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

	dist := make([]int, n)
	for i := range dist {
		dist[i] = INF
	}
	dist[start] = 0

	type Edge struct {
		u, v, w int
	}
	edges := make([]Edge, m)
	for i := 0; i < m; i++ {
		edges[i] = Edge{
			u: arr[2+3*i],
			v: arr[2+3*i+1],
			w: arr[2+3*i+2],
		}
	}

	for i := 0; i < n-1; i++ {
		for _, e := range edges {
			if dist[e.u] != INF && dist[e.u]+e.w < dist[e.v] {
				dist[e.v] = dist[e.u] + e.w
			}
		}
	}

	for _, e := range edges {
		if dist[e.u] != INF && dist[e.u]+e.w < dist[e.v] {
			return []int{} // Negative cycle
		}
	}

	return dist
}
