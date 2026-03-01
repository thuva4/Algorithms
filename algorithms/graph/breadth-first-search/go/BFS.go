package bfs

import "sort"

func Bfs(arr []int) []int {
	if len(arr) < 2 {
		return []int{}
	}

	n := arr[0]
	m := arr[1]

	if len(arr) < 2+2*m+1 {
		return []int{}
	}

	start := arr[2+2*m]
	if start < 0 || start >= n {
		return []int{}
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

	for i := 0; i < n; i++ {
		sort.Ints(adj[i])
	}

	result := []int{}
	visited := make([]bool, n)
	q := []int{start}
	visited[start] = true

	for len(q) > 0 {
		u := q[0]
		q = q[1:]
		result = append(result, u)

		for _, v := range adj[u] {
			if !visited[v] {
				visited[v] = true
				q = append(q, v)
			}
		}
	}

	return result
}
