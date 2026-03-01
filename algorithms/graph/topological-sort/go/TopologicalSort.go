package main

import "fmt"

// topologicalSort performs a topological sort on a directed acyclic graph.
// Returns a slice of nodes in topological order.
func topologicalSort(adjList map[int][]int) []int {
	visited := make(map[int]bool)
	stack := []int{}

	var dfs func(node int)
	dfs = func(node int) {
		visited[node] = true

		for _, neighbor := range adjList[node] {
			if !visited[neighbor] {
				dfs(neighbor)
			}
		}

		stack = append(stack, node)
	}

	// Process all nodes in order
	numNodes := len(adjList)
	for i := 0; i < numNodes; i++ {
		if !visited[i] {
			dfs(i)
		}
	}

	// Reverse the stack
	result := make([]int, len(stack))
	for i, v := range stack {
		result[len(stack)-1-i] = v
	}
	return result
}

func main() {
	adjList := map[int][]int{
		0: {1, 2},
		1: {3},
		2: {3},
		3: {},
	}

	result := topologicalSort(adjList)
	fmt.Println("Topological order:", result)
}
