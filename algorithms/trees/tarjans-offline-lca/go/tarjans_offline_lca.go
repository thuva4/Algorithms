package tarjansofflinelca

func offline_lca(n int, edges [][]int, queries [][]int) []int {
	if n <= 0 {
		return []int{}
	}

	adj := make([][]int, n)
	for _, edge := range edges {
		if len(edge) < 2 {
			continue
		}
		u := edge[0]
		v := edge[1]
		if u < 0 || v < 0 || u >= n || v >= n {
			continue
		}
		adj[u] = append(adj[u], v)
		adj[v] = append(adj[v], u)
	}

	parent := make([]int, n)
	depth := make([]int, n)
	for i := range parent {
		parent[i] = -1
	}
	parent[0] = 0

	queue := []int{0}
	for head := 0; head < len(queue); head++ {
		node := queue[head]
		for _, next := range adj[node] {
			if parent[next] != -1 {
				continue
			}
			parent[next] = node
			depth[next] = depth[node] + 1
			queue = append(queue, next)
		}
	}

	results := make([]int, 0, len(queries))
	for _, query := range queries {
		if len(query) < 2 {
			results = append(results, -1)
			continue
		}
		u := query[0]
		v := query[1]
		if u < 0 || v < 0 || u >= n || v >= n {
			results = append(results, -1)
			continue
		}
		for depth[u] > depth[v] {
			u = parent[u]
		}
		for depth[v] > depth[u] {
			v = parent[v]
		}
		for u != v {
			u = parent[u]
			v = parent[v]
		}
		results = append(results, u)
	}

	return results
}
