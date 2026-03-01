package bipartitecheck

func IsBipartite(arr []int) int {
	if len(arr) < 2 {
		return 0
	}

	n := arr[0]
	m := arr[1]

	if len(arr) < 2+2*m {
		return 0
	}
	if n == 0 {
		return 1
	}

	adj := make([][]int, n)
	for i := 0; i < m; i++ {
		u := arr[2+2*i]
		v := arr[2+2*i+1]
		if u >= 0 && u < n && v >= 0 && v < n {
			adj[u] = append(adj[u], v)
			adj[v] = append(adj[v], u)
		}
	}

	color := make([]int, n) // 0: none, 1: red, -1: blue
	q := []int{}

	for i := 0; i < n; i++ {
		if color[i] == 0 {
			color[i] = 1
			q = append(q, i)

			for len(q) > 0 {
				u := q[0]
				q = q[1:]

				for _, v := range adj[u] {
					if color[v] == 0 {
						color[v] = -color[u]
						q = append(q, v)
					} else if color[v] == color[u] {
						return 0
					}
				}
			}
		}
	}

	return 1
}
