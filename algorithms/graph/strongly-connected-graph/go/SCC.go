package main

import "fmt"

// findSCCs uses Kosaraju's algorithm to find strongly connected components.
func findSCCs(adjList map[int][]int) [][]int {
	numNodes := len(adjList)
	visited := make(map[int]bool)
	finishOrder := []int{}

	// First DFS pass
	var dfs1 func(node int)
	dfs1 = func(node int) {
		visited[node] = true
		for _, neighbor := range adjList[node] {
			if !visited[neighbor] {
				dfs1(neighbor)
			}
		}
		finishOrder = append(finishOrder, node)
	}

	for i := 0; i < numNodes; i++ {
		if !visited[i] {
			dfs1(i)
		}
	}

	// Build reverse graph
	revAdj := make(map[int][]int)
	for node, neighbors := range adjList {
		if _, exists := revAdj[node]; !exists {
			revAdj[node] = []int{}
		}
		for _, neighbor := range neighbors {
			revAdj[neighbor] = append(revAdj[neighbor], node)
		}
	}

	// Second DFS pass on reversed graph
	visited = make(map[int]bool)
	var components [][]int

	var dfs2 func(node int, component *[]int)
	dfs2 = func(node int, component *[]int) {
		visited[node] = true
		*component = append(*component, node)
		for _, neighbor := range revAdj[node] {
			if !visited[neighbor] {
				dfs2(neighbor, component)
			}
		}
	}

	for i := len(finishOrder) - 1; i >= 0; i-- {
		node := finishOrder[i]
		if !visited[node] {
			component := []int{}
			dfs2(node, &component)
			components = append(components, component)
		}
	}

	return components
}

func main() {
	adjList := map[int][]int{
		0: {1},
		1: {2},
		2: {0, 3},
		3: {4},
		4: {3},
	}

	components := findSCCs(adjList)
	fmt.Println("Strongly connected components:")
	for i, comp := range components {
		fmt.Printf("SCC %d: %v\n", i, comp)
	}
}
