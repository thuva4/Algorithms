package graphcoloring

func ChromaticNumber(arr []int) int {
	n := arr[0]
	m := arr[1]
	if n == 0 {
		return 0
	}
	if m == 0 {
		return 1
	}

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

	isSafe := func(colors []int, v, c int) bool {
		for _, u := range adj[v] {
			if colors[u] == c {
				return false
			}
		}
		return true
	}

	var solve func(colors []int, v, k int) bool
	solve = func(colors []int, v, k int) bool {
		if v == n {
			return true
		}
		for c := 1; c <= k; c++ {
			if isSafe(colors, v, c) {
				colors[v] = c
				if solve(colors, v+1, k) {
					return true
				}
				colors[v] = 0
			}
		}
		return false
	}

	for k := 1; k <= n; k++ {
		colors := make([]int, n)
		if solve(colors, 0, k) {
			return k
		}
	}
	return n
}
