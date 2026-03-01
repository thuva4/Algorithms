package allpairsshortestpath

const INF = 1000000000

func AllPairsShortestPath(arr []int) int {
	if len(arr) < 2 {
		return -1
	}

	n := arr[0]
	m := arr[1]

	if len(arr) < 2+3*m {
		return -1
	}
	if n <= 0 {
		return -1
	}
	if n == 1 {
		return 0
	}

	dist := make([][]int, n)
	for i := range dist {
		dist[i] = make([]int, n)
		for j := range dist[i] {
			if i == j {
				dist[i][j] = 0
			} else {
				dist[i][j] = INF
			}
		}
	}

	for i := 0; i < m; i++ {
		u := arr[2+3*i]
		v := arr[2+3*i+1]
		w := arr[2+3*i+2]

		if u >= 0 && u < n && v >= 0 && v < n {
			if w < dist[u][v] {
				dist[u][v] = w
			}
		}
	}

	for k := 0; k < n; k++ {
		for i := 0; i < n; i++ {
			for j := 0; j < n; j++ {
				if dist[i][k] != INF && dist[k][j] != INF {
					if dist[i][k]+dist[k][j] < dist[i][j] {
						dist[i][j] = dist[i][k] + dist[k][j]
					}
				}
			}
		}
	}

	result := dist[0][n-1]
	if result == INF {
		return -1
	}
	return result
}
