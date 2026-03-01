package main

import (
	"fmt"
	"math"
)

// Edge represents a directed weighted edge.
type Edge struct {
	src, dest, weight int
}

// bellmanFord finds shortest paths from startNode.
// Returns a map of node to shortest distance, or nil if a negative cycle is detected.
func bellmanFord(numVertices int, edges []Edge, startNode int) map[int]interface{} {
	dist := make(map[int]float64)

	for i := 0; i < numVertices; i++ {
		dist[i] = math.Inf(1)
	}
	dist[startNode] = 0

	// Relax all edges V-1 times
	for i := 0; i < numVertices-1; i++ {
		for _, e := range edges {
			if dist[e.src] != math.Inf(1) && dist[e.src]+float64(e.weight) < dist[e.dest] {
				dist[e.dest] = dist[e.src] + float64(e.weight)
			}
		}
	}

	// Check for negative weight cycles
	for _, e := range edges {
		if dist[e.src] != math.Inf(1) && dist[e.src]+float64(e.weight) < dist[e.dest] {
			return nil // Negative cycle detected
		}
	}

	result := make(map[int]interface{})
	for k, v := range dist {
		if math.IsInf(v, 1) {
			result[k] = "Infinity"
		} else {
			result[k] = int(v)
		}
	}
	return result
}

func main() {
	edges := []Edge{
		{0, 1, 4},
		{0, 2, 1},
		{2, 1, 2},
		{1, 3, 1},
		{2, 3, 5},
	}

	result := bellmanFord(4, edges, 0)
	if result == nil {
		fmt.Println("Negative cycle detected")
	} else {
		fmt.Println("Shortest distances:", result)
	}
}
