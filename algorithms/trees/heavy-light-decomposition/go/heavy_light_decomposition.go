package heavylightdecomposition

func scalarToInt(value interface{}) (int, bool) {
	switch typed := value.(type) {
	case int:
		return typed, true
	case int64:
		return int(typed), true
	case float64:
		return int(typed), true
	default:
		return 0, false
	}
}

func buildParents(n int, edges [][]int) ([]int, []int, [][]int) {
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
	if n == 0 {
		return parent, depth, adj
	}

	queue := []int{0}
	parent[0] = 0
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
	return parent, depth, adj
}

func pathNodes(parent []int, depth []int, u int, v int) []int {
	left := make([]int, 0)
	right := make([]int, 0)

	for depth[u] > depth[v] {
		left = append(left, u)
		u = parent[u]
	}
	for depth[v] > depth[u] {
		right = append(right, v)
		v = parent[v]
	}
	for u != v {
		left = append(left, u)
		right = append(right, v)
		u = parent[u]
		v = parent[v]
	}

	left = append(left, u)
	for i := len(right) - 1; i >= 0; i-- {
		left = append(left, right[i])
	}
	return left
}

func hld_path_query(n int, edges [][]int, values []int, queries []map[string]interface{}) []int {
	if n <= 0 {
		return []int{}
	}

	parent, depth, _ := buildParents(n, edges)
	results := make([]int, 0, len(queries))

	for _, query := range queries {
		queryType, _ := query["type"].(string)
		uValue, okU := query["u"]
		vValue, okV := query["v"]
		if !okU || !okV {
			results = append(results, 0)
			continue
		}
		u, okU := scalarToInt(uValue)
		v, okV := scalarToInt(vValue)
		if !okU || !okV {
			results = append(results, 0)
			continue
		}
		if u < 0 || v < 0 || u >= n || v >= n {
			results = append(results, 0)
			continue
		}

		nodes := pathNodes(parent, depth, u, v)
		if queryType == "sum" {
			sum := 0
			for _, node := range nodes {
				if node >= 0 && node < len(values) {
					sum += values[node]
				}
			}
			results = append(results, sum)
			continue
		}

		best := 0
		first := true
		for _, node := range nodes {
			value := 0
			if node >= 0 && node < len(values) {
				value = values[node]
			}
			if first || value > best {
				best = value
				first = false
			}
		}
		results = append(results, best)
	}

	return results
}
