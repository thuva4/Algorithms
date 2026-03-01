package bipartitecheck

func IsBipartite(arr []int) int {
	n := arr[0]
	m := arr[1]
	adj := make([][]int, n)
	for i := 0; i < n; i++ {
		adj[i] = []int{}
	}
	for i := 0; i < m; i++ {
		u := arr[2+2*i]
		v := arr[2+2*i+1]
		adj[u] = append(adj[u], v)
		adj[v] = append(adj[v], u)
	}

	color := make([]int, n)
	for i := range color {
		color[i] = -1
	}

	for start := 0; start < n; start++ {
		if color[start] != -1 {
			continue
		}
		color[start] = 0
		queue := []int{start}
		for len(queue) > 0 {
			u := queue[0]
			queue = queue[1:]
			for _, v := range adj[u] {
				if color[v] == -1 {
					color[v] = 1 - color[u]
					queue = append(queue, v)
				} else if color[v] == color[u] {
					return 0
				}
			}
		}
	}

	return 1
}
