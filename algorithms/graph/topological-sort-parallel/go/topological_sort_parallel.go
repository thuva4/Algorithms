package main

func TopologicalSortParallel(data []int) int {
	n := data[0]
	m := data[1]

	adj := make([][]int, n)
	for i := range adj {
		adj[i] = []int{}
	}
	indegree := make([]int, n)

	idx := 2
	for e := 0; e < m; e++ {
		u, v := data[idx], data[idx+1]
		adj[u] = append(adj[u], v)
		indegree[v]++
		idx += 2
	}

	queue := []int{}
	for i := 0; i < n; i++ {
		if indegree[i] == 0 {
			queue = append(queue, i)
		}
	}

	rounds := 0
	processed := 0

	for len(queue) > 0 {
		size := len(queue)
		for i := 0; i < size; i++ {
			node := queue[i]
			processed++
			for _, neighbor := range adj[node] {
				indegree[neighbor]--
				if indegree[neighbor] == 0 {
					queue = append(queue, neighbor)
				}
			}
		}
		queue = queue[size:]
		rounds++
	}

	if processed == n {
		return rounds
	}
	return -1
}
