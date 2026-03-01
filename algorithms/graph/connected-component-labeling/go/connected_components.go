package connectedcomponents

func ConnectedComponents(arr []int) []int {
	if len(arr) < 2 {
		return []int{}
	}

	n := arr[0]
	m := arr[1]

	if len(arr) < 2+2*m {
		return []int{}
	}
	if n == 0 {
		return []int{}
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

	labels := make([]int, n)
	for i := range labels {
		labels[i] = -1
	}

	q := []int{}

	for i := 0; i < n; i++ {
		if labels[i] == -1 {
			componentID := i
			labels[i] = componentID
			q = append(q, i)

			for len(q) > 0 {
				u := q[0]
				q = q[1:]

				for _, v := range adj[u] {
					if labels[v] == -1 {
						labels[v] = componentID
						q = append(q, v)
					}
				}
			}
		}
	}

	return labels
}
