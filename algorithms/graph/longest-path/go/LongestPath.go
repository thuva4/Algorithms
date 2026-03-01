package main

import (
	"fmt"
	"math"
)

// longestPath finds the longest path in a DAG from startNode.
func longestPath(adjList map[int][][2]int, startNode int) map[int]float64 {
	numNodes := len(adjList)
	visited := make(map[int]bool)
	topoOrder := []int{}

	var dfs func(node int)
	dfs = func(node int) {
		visited[node] = true
		for _, edge := range adjList[node] {
			if !visited[edge[0]] {
				dfs(edge[0])
			}
		}
		topoOrder = append(topoOrder, node)
	}

	for i := 0; i < numNodes; i++ {
		if !visited[i] {
			dfs(i)
		}
	}

	// Initialize distances
	dist := make(map[int]float64)
	for i := 0; i < numNodes; i++ {
		dist[i] = math.Inf(-1)
	}
	dist[startNode] = 0

	// Process in topological order
	for i := len(topoOrder) - 1; i >= 0; i-- {
		u := topoOrder[i]
		if dist[u] != math.Inf(-1) {
			for _, edge := range adjList[u] {
				v, w := edge[0], edge[1]
				if dist[u]+float64(w) > dist[v] {
					dist[v] = dist[u] + float64(w)
				}
			}
		}
	}

	return dist
}

func main() {
	adjList := map[int][][2]int{
		0: {{1, 3}, {2, 6}},
		1: {{3, 4}, {2, 4}},
		2: {{3, 2}},
		3: {},
	}

	result := longestPath(adjList, 0)
	fmt.Println("Longest distances from node 0:")
	for i := 0; i < 4; i++ {
		if math.IsInf(result[i], -1) {
			fmt.Printf("Node %d: -Infinity\n", i)
		} else {
			fmt.Printf("Node %d: %.0f\n", i, result[i])
		}
	}
}
