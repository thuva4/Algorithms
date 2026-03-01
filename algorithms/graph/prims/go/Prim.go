package main

import (
	"fmt"
	"math"
)

// prim finds the MST total weight using Prim's algorithm.
// Input: number of vertices, weighted adjacency list where each entry is [neighbor, weight].
func prim(numVertices int, adjList map[int][][2]int) int {
	inMST := make([]bool, numVertices)
	key := make([]int, numVertices)

	for i := range key {
		key[i] = math.MaxInt32
	}
	key[0] = 0

	totalWeight := 0

	for count := 0; count < numVertices; count++ {
		// Find minimum key vertex not in MST
		u := -1
		minKey := math.MaxInt32
		for i := 0; i < numVertices; i++ {
			if !inMST[i] && key[i] < minKey {
				minKey = key[i]
				u = i
			}
		}

		if u == -1 {
			break
		}

		inMST[u] = true
		totalWeight += key[u]

		// Update keys of adjacent vertices
		for _, edge := range adjList[u] {
			v, w := edge[0], edge[1]
			if !inMST[v] && w < key[v] {
				key[v] = w
			}
		}
	}

	return totalWeight
}

func main() {
	adjList := map[int][][2]int{
		0: {{1, 10}, {2, 6}, {3, 5}},
		1: {{0, 10}, {3, 15}},
		2: {{0, 6}, {3, 4}},
		3: {{0, 5}, {1, 15}, {2, 4}},
	}

	result := prim(4, adjList)
	fmt.Println("MST total weight:", result)
}
