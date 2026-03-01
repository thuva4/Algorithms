package main

import "fmt"

// connectedComponents finds all connected components using DFS.
func connectedComponents(adjList map[int][]int) [][]int {
	visited := make(map[int]bool)
	var components [][]int

	numNodes := len(adjList)
	for i := 0; i < numNodes; i++ {
		if !visited[i] {
			component := []int{}
			dfs(adjList, i, visited, &component)
			components = append(components, component)
		}
	}

	return components
}

func dfs(adjList map[int][]int, node int, visited map[int]bool, component *[]int) {
	visited[node] = true
	*component = append(*component, node)

	for _, neighbor := range adjList[node] {
		if !visited[neighbor] {
			dfs(adjList, neighbor, visited, component)
		}
	}
}

func main() {
	adjList := map[int][]int{
		0: {1},
		1: {0},
		2: {3},
		3: {2},
	}

	components := connectedComponents(adjList)
	fmt.Println("Connected components:")
	for _, comp := range components {
		fmt.Println(comp)
	}
}
