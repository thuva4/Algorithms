package graphcycledetection

func GraphCycleDetection(arr []int) int {
	n := arr[0]; m := arr[1]
	adj := make([][]int, n)
	for i := 0; i < n; i++ { adj[i] = []int{} }
	for i := 0; i < m; i++ {
		adj[arr[2+2*i]] = append(adj[arr[2+2*i]], arr[2+2*i+1])
	}
	color := make([]int, n)

	var dfs func(v int) bool
	dfs = func(v int) bool {
		color[v] = 1
		for _, w := range adj[v] {
			if color[w] == 1 { return true }
			if color[w] == 0 && dfs(w) { return true }
		}
		color[v] = 2
		return false
	}

	for v := 0; v < n; v++ {
		if color[v] == 0 && dfs(v) { return 1 }
	}
	return 0
}
