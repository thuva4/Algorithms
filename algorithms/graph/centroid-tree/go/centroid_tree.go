package centroidtree

import "math"

func CentroidTree(arr []int) int {
	if len(arr) < 1 {
		return 0
	}
	n := arr[0]

	if n <= 1 {
		return 0
	}
	if len(arr) < 1+2*(n-1) {
		return 0
	}

	adj := make([][]int, n)
	for i := 0; i < n-1; i++ {
		u := arr[1+2*i]
		v := arr[1+2*i+1]
		if u >= 0 && u < n && v >= 0 && v < n {
			adj[u] = append(adj[u], v)
			adj[v] = append(adj[v], u)
		}
	}

	sz := make([]int, n)
	removed := make([]bool, n)
	maxDepth := 0

	var getSize func(int, int)
	getSize = func(u, p int) {
		sz[u] = 1
		for _, v := range adj[u] {
			if v != p && !removed[v] {
				getSize(v, u)
				sz[u] += sz[v]
			}
		}
	}

	var getCentroid func(int, int, int) int
	getCentroid = func(u, p, total int) int {
		for _, v := range adj[u] {
			if v != p && !removed[v] && sz[v] > total/2 {
				return getCentroid(v, u, total)
			}
		}
		return u
	}

	var decompose func(int, int)
	decompose = func(u, depth int) {
		getSize(u, -1)
		total := sz[u]
		centroid := getCentroid(u, -1, total)

		if depth > maxDepth {
			maxDepth = depth
		}

		removed[centroid] = true

		for _, v := range adj[centroid] {
			if !removed[v] {
				decompose(v, depth+1)
			}
		}
	}

	decompose(0, 0)

	return maxDepth
}
