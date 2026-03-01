package chromaticnumber

func ChromaticNumber(arr []int) int {
	if len(arr) < 2 {
		return 0
	}
	n := arr[0]
	m := arr[1]

	if len(arr) < 2+2*m {
		return 0
	}
	if n == 0 {
		return 0
	}

	adj := make([][]bool, n)
	for i := range adj {
		adj[i] = make([]bool, n)
	}

	for i := 0; i < m; i++ {
		u := arr[2+2*i]
		v := arr[2+2*i+1]
		if u >= 0 && u < n && v >= 0 && v < n {
			adj[u][v] = true
			adj[v][u] = true
		}
	}

	color := make([]int, n)

	for k := 1; k <= n; k++ {
		// Reset color array? No need, but backtrack resets it to 0
		if graphColoringUtil(0, n, k, color, adj) {
			return k
		}
	}

	return n
}

func isSafe(u, c, n int, color []int, adj [][]bool) bool {
	for v := 0; v < n; v++ {
		if adj[u][v] && color[v] == c {
			return false
		}
	}
	return true
}

func graphColoringUtil(u, n, k int, color []int, adj [][]bool) bool {
	if u == n {
		return true
	}

	for c := 1; c <= k; c++ {
		if isSafe(u, c, n, color, adj) {
			color[u] = c
			if graphColoringUtil(u+1, n, k, color, adj) {
				return true
			}
			color[u] = 0
		}
	}
	return false
}
