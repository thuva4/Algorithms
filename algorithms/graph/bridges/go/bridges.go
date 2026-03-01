package bridges

import "math"

func CountBridges(arr []int) int {
	if len(arr) < 2 {
		return 0
	}
	n := arr[0]
	m := arr[1]

	if len(arr) < 2+2*m {
		return 0
	}

	adj := make([][]int, n)
	for i := 0; i < m; i++ {
		u := arr[2+2*i]
		v := arr[2+2*i+1]
		if u >= 0 && u < n && v >= 0 && v < n {
			adj[u] = append(adj[u], v)
			adj[v] = append(adj[v], u)
		}
	}

	dfn := make([]int, n)
	low := make([]int, n)
	timer := 0
	bridgeCount := 0

	var dfs func(int, int)
	dfs = func(u, p int) {
		timer++
		dfn[u] = timer
		low[u] = timer

		for _, v := range adj[u] {
			if v == p {
				continue
			}
			if dfn[v] != 0 {
				low[u] = int(math.Min(float64(low[u]), float64(dfn[v])))
			} else {
				dfs(v, u)
				low[u] = int(math.Min(float64(low[u]), float64(low[v])))
				if low[v] > dfn[u] {
					bridgeCount++
				}
			}
		}
	}

	for i := 0; i < n; i++ {
		if dfn[i] == 0 {
			dfs(i, -1)
		}
	}

	return bridgeCount
}
