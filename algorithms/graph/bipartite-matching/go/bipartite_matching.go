package bipartitematching

import "math"

func HopcroftKarp(arr []int) int {
	if len(arr) < 3 {
		return 0
	}

	nLeft := arr[0]
	nRight := arr[1]
	m := arr[2]

	if len(arr) < 3+2*m {
		return 0
	}
	if nLeft == 0 || nRight == 0 {
		return 0
	}

	adj := make([][]int, nLeft)
	for i := 0; i < nLeft; i++ {
		adj[i] = []int{}
	}

	for i := 0; i < m; i++ {
		u := arr[3+2*i]
		v := arr[3+2*i+1]
		if u >= 0 && u < nLeft && v >= 0 && v < nRight {
			adj[u] = append(adj[u], v)
		}
	}

	pairU := make([]int, nLeft)
	pairV := make([]int, nRight)
	dist := make([]int, nLeft+1)

	for i := range pairU {
		pairU[i] = -1
	}
	for i := range pairV {
		pairV[i] = -1
	}

	var bfs func() bool
	bfs = func() bool {
		q := []int{}
		for u := 0; u < nLeft; u++ {
			if pairU[u] == -1 {
				dist[u] = 0
				q = append(q, u)
			} else {
				dist[u] = math.MaxInt32
			}
		}
		dist[nLeft] = math.MaxInt32

		for len(q) > 0 {
			u := q[0]
			q = q[1:]

			if dist[u] < dist[nLeft] {
				for _, v := range adj[u] {
					pu := pairV[v]
					if pu == -1 {
						if dist[nLeft] == math.MaxInt32 {
							dist[nLeft] = dist[u] + 1
						}
					} else if dist[pu] == math.MaxInt32 {
						dist[pu] = dist[u] + 1
						q = append(q, pu)
					}
				}
			}
		}
		return dist[nLeft] != math.MaxInt32
	}

	var dfs func(int) bool
	dfs = func(u int) bool {
		if u != -1 {
			for _, v := range adj[u] {
				pu := pairV[v]
				if pu == -1 || (dist[pu] == dist[u]+1 && dfs(pu)) {
					pairV[v] = u
					pairU[u] = v
					return true
				}
			}
			dist[u] = math.MaxInt32
			return false
		}
		return true
	}

	matching := 0
	for bfs() {
		for u := 0; u < nLeft; u++ {
			if pairU[u] == -1 && dfs(u) {
				matching++
			}
		}
	}

	return matching
}
