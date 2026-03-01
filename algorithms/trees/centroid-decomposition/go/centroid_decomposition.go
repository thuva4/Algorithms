package main

import "fmt"

func CentroidDecomposition(arr []int) int {
	idx := 0
	n := arr[idx]; idx++
	if n <= 1 { return 0 }

	adj := make([][]int, n)
	m := (len(arr) - 1) / 2
	for i := 0; i < m; i++ {
		u := arr[idx]; idx++
		v := arr[idx]; idx++
		adj[u] = append(adj[u], v)
		adj[v] = append(adj[v], u)
	}

	removed := make([]bool, n)
	subSize := make([]int, n)

	var getSubSize func(int, int)
	getSubSize = func(v, parent int) {
		subSize[v] = 1
		for _, u := range adj[v] {
			if u != parent && !removed[u] {
				getSubSize(u, v)
				subSize[v] += subSize[u]
			}
		}
	}

	var getCentroid func(int, int, int) int
	getCentroid = func(v, parent, treeSize int) int {
		for _, u := range adj[v] {
			if u != parent && !removed[u] && subSize[u] > treeSize/2 {
				return getCentroid(u, v, treeSize)
			}
		}
		return v
	}

	var decompose func(int, int) int
	decompose = func(v, depth int) int {
		getSubSize(v, -1)
		centroid := getCentroid(v, -1, subSize[v])
		removed[centroid] = true
		maxDepth := depth
		for _, u := range adj[centroid] {
			if !removed[u] {
				result := decompose(u, depth+1)
				if result > maxDepth { maxDepth = result }
			}
		}
		removed[centroid] = false
		return maxDepth
	}

	return decompose(0, 0)
}

func main() {
	fmt.Println(CentroidDecomposition([]int{4, 0, 1, 1, 2, 2, 3}))
	fmt.Println(CentroidDecomposition([]int{5, 0, 1, 0, 2, 0, 3, 0, 4}))
	fmt.Println(CentroidDecomposition([]int{1}))
	fmt.Println(CentroidDecomposition([]int{7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6}))
}
