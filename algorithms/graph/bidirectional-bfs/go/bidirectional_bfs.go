package bidirectionalbfs

func BidirectionalBfs(arr []int) int {
	if len(arr) < 4 {
		return -1
	}

	n := arr[0]
	m := arr[1]
	start := arr[2]
	end := arr[3]

	if len(arr) < 4+2*m {
		return -1
	}
	if start == end {
		return 0
	}

	adj := make([][]int, n)
	for i := 0; i < m; i++ {
		u := arr[4+2*i]
		v := arr[4+2*i+1]
		if u >= 0 && u < n && v >= 0 && v < n {
			adj[u] = append(adj[u], v)
			adj[v] = append(adj[v], u)
		}
	}

	distStart := make([]int, n)
	distEnd := make([]int, n)
	for i := 0; i < n; i++ {
		distStart[i] = -1
		distEnd[i] = -1
	}

	qStart := []int{start}
	distStart[start] = 0

	qEnd := []int{end}
	distEnd[end] = 0

	for len(qStart) > 0 && len(qEnd) > 0 {
		u := qStart[0]
		qStart = qStart[1:]

		if distEnd[u] != -1 {
			return distStart[u] + distEnd[u]
		}

		for _, v := range adj[u] {
			if distStart[v] == -1 {
				distStart[v] = distStart[u] + 1
				if distEnd[v] != -1 {
					return distStart[v] + distEnd[v]
				}
				qStart = append(qStart, v)
			}
		}

		u = qEnd[0]
		qEnd = qEnd[1:]

		if distStart[u] != -1 {
			return distStart[u] + distEnd[u]
		}

		for _, v := range adj[u] {
			if distEnd[v] == -1 {
				distEnd[v] = distEnd[u] + 1
				if distStart[v] != -1 {
					return distStart[v] + distEnd[v]
				}
				qEnd = append(qEnd, v)
			}
		}
	}

	return -1
}
