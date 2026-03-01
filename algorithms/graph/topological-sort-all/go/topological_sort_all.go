package topologicalsortall

func TopologicalSortAll(arr []int) int {
	n := arr[0]
	m := arr[1]
	adj := make([][]int, n)
	for i := 0; i < n; i++ { adj[i] = []int{} }
	inDeg := make([]int, n)
	for i := 0; i < m; i++ {
		u := arr[2+2*i]; v := arr[2+2*i+1]
		adj[u] = append(adj[u], v)
		inDeg[v]++
	}
	visited := make([]bool, n)
	count := 0

	var backtrack func(placed int)
	backtrack = func(placed int) {
		if placed == n { count++; return }
		for v := 0; v < n; v++ {
			if !visited[v] && inDeg[v] == 0 {
				visited[v] = true
				for _, w := range adj[v] { inDeg[w]-- }
				backtrack(placed + 1)
				visited[v] = false
				for _, w := range adj[v] { inDeg[w]++ }
			}
		}
	}

	backtrack(0)
	return count
}
