package maximumbipartitematching

func MaximumBipartiteMatching(arr []int) int {
	nLeft := arr[0]; nRight := arr[1]; m := arr[2]
	adj := make([][]int, nLeft)
	for i := 0; i < nLeft; i++ { adj[i] = []int{} }
	for i := 0; i < m; i++ { adj[arr[3+2*i]] = append(adj[arr[3+2*i]], arr[3+2*i+1]) }
	matchRight := make([]int, nRight)
	for i := range matchRight { matchRight[i] = -1 }

	var dfs func(u int, visited []bool) bool
	dfs = func(u int, visited []bool) bool {
		for _, v := range adj[u] {
			if !visited[v] {
				visited[v] = true
				if matchRight[v] == -1 || dfs(matchRight[v], visited) {
					matchRight[v] = u; return true
				}
			}
		}
		return false
	}

	result := 0
	for u := 0; u < nLeft; u++ {
		visited := make([]bool, nRight)
		if dfs(u, visited) { result++ }
	}
	return result
}
