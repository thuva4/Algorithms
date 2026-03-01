package countingtriangles

func CountingTriangles(arr []int) int {
	if len(arr) < 2 {
		return 0
	}
	n := arr[0]
	m := arr[1]

	if len(arr) < 2+2*m {
		return 0
	}
	if n < 3 {
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

	count := 0
	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			if adj[i][j] {
				for k := j + 1; k < n; k++ {
					if adj[j][k] && adj[k][i] {
						count++
					}
				}
			}
		}
	}

	return count
}
