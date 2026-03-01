package kosarajusscc

func KosarajusScc(arr []int) int {
	n := arr[0]
	m := arr[1]
	adj := make([][]int, n)
	radj := make([][]int, n)
	for i := 0; i < n; i++ {
		adj[i] = []int{}
		radj[i] = []int{}
	}
	for i := 0; i < m; i++ {
		u := arr[2+2*i]
		v := arr[2+2*i+1]
		adj[u] = append(adj[u], v)
		radj[v] = append(radj[v], u)
	}

	visited := make([]bool, n)
	order := []int{}

	var dfs1 func(v int)
	dfs1 = func(v int) {
		visited[v] = true
		for _, w := range adj[v] {
			if !visited[w] {
				dfs1(w)
			}
		}
		order = append(order, v)
	}

	for v := 0; v < n; v++ {
		if !visited[v] {
			dfs1(v)
		}
	}

	for i := range visited {
		visited[i] = false
	}
	sccCount := 0

	var dfs2 func(v int)
	dfs2 = func(v int) {
		visited[v] = true
		for _, w := range radj[v] {
			if !visited[w] {
				dfs2(w)
			}
		}
	}

	for i := len(order) - 1; i >= 0; i-- {
		v := order[i]
		if !visited[v] {
			dfs2(v)
			sccCount++
		}
	}

	return sccCount
}
