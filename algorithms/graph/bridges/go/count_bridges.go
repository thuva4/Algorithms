package bridges

func CountBridges(arr []int) int {
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

	disc := make([]int, n)
	low := make([]int, n)
	parent := make([]int, n)
	for i := 0; i < n; i++ {
		disc[i] = -1
		parent[i] = -1
	}
	timer := 0
	bridgeCount := 0

	var dfs func(u int)
	dfs = func(u int) {
		disc[u] = timer
		low[u] = timer
		timer++

		for _, v := range adj[u] {
			if disc[v] == -1 {
				parent[v] = u
				dfs(v)
				if low[v] < low[u] {
					low[u] = low[v]
				}
				if low[v] > disc[u] {
					bridgeCount++
				}
			} else if v != parent[u] {
				if disc[v] < low[u] {
					low[u] = disc[v]
				}
			}
		}
	}

	for i := 0; i < n; i++ {
		if disc[i] == -1 {
			dfs(i)
		}
	}

	return bridgeCount
}
