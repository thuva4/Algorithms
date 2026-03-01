package main

import "fmt"

// edmondsKarp finds the maximum flow using the Edmonds-Karp algorithm.
func edmondsKarp(capacity [][]int, source, sink int) int {
	if source == sink {
		return 0
	}

	n := len(capacity)
	// Create residual graph
	residual := make([][]int, n)
	for i := range residual {
		residual[i] = make([]int, n)
		copy(residual[i], capacity[i])
	}

	totalFlow := 0

	for {
		// BFS to find augmenting path
		parent := make([]int, n)
		for i := range parent {
			parent[i] = -1
		}
		visited := make([]bool, n)
		queue := []int{source}
		visited[source] = true

		for len(queue) > 0 && !visited[sink] {
			u := queue[0]
			queue = queue[1:]
			for v := 0; v < n; v++ {
				if !visited[v] && residual[u][v] > 0 {
					visited[v] = true
					parent[v] = u
					queue = append(queue, v)
				}
			}
		}

		if !visited[sink] {
			break
		}

		// Find minimum capacity along path
		pathFlow := int(^uint(0) >> 1) // MaxInt
		for v := sink; v != source; v = parent[v] {
			if residual[parent[v]][v] < pathFlow {
				pathFlow = residual[parent[v]][v]
			}
		}

		// Update residual capacities
		for v := sink; v != source; v = parent[v] {
			residual[parent[v]][v] -= pathFlow
			residual[v][parent[v]] += pathFlow
		}

		totalFlow += pathFlow
	}

	return totalFlow
}

func main() {
	capacity := [][]int{
		{0, 10, 10, 0, 0, 0},
		{0, 0, 2, 4, 8, 0},
		{0, 0, 0, 0, 9, 0},
		{0, 0, 0, 0, 0, 10},
		{0, 0, 0, 6, 0, 10},
		{0, 0, 0, 0, 0, 0},
	}

	result := edmondsKarp(capacity, 0, 5)
	fmt.Println("Maximum flow:", result)
}
