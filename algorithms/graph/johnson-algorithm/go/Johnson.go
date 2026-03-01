package main

import (
	"fmt"
	"math"
)

type Edge struct {
	src, dest, weight int
}

func bellmanFord(numVertices int, edges []Edge, src int) ([]float64, bool) {
	dist := make([]float64, numVertices)
	for i := range dist {
		dist[i] = math.Inf(1)
	}
	dist[src] = 0

	for i := 0; i < numVertices-1; i++ {
		for _, e := range edges {
			if dist[e.src] != math.Inf(1) && dist[e.src]+float64(e.weight) < dist[e.dest] {
				dist[e.dest] = dist[e.src] + float64(e.weight)
			}
		}
	}

	for _, e := range edges {
		if dist[e.src] != math.Inf(1) && dist[e.src]+float64(e.weight) < dist[e.dest] {
			return nil, false
		}
	}

	return dist, true
}

func dijkstra(numVertices int, adjList map[int][][2]int, src int) []float64 {
	dist := make([]float64, numVertices)
	visited := make([]bool, numVertices)
	for i := range dist {
		dist[i] = math.Inf(1)
	}
	dist[src] = 0

	for count := 0; count < numVertices; count++ {
		u := -1
		minDist := math.Inf(1)
		for i := 0; i < numVertices; i++ {
			if !visited[i] && dist[i] < minDist {
				minDist = dist[i]
				u = i
			}
		}
		if u == -1 {
			break
		}
		visited[u] = true
		for _, edge := range adjList[u] {
			v, w := edge[0], edge[1]
			if !visited[v] && dist[u]+float64(w) < dist[v] {
				dist[v] = dist[u] + float64(w)
			}
		}
	}
	return dist
}

// johnson computes all-pairs shortest paths using Johnson's algorithm.
func johnson(numVertices int, edges []Edge) (map[int]map[int]float64, bool) {
	// Add virtual node
	allEdges := make([]Edge, len(edges))
	copy(allEdges, edges)
	for i := 0; i < numVertices; i++ {
		allEdges = append(allEdges, Edge{numVertices, i, 0})
	}

	h, ok := bellmanFord(numVertices+1, allEdges, numVertices)
	if !ok {
		return nil, false
	}

	// Reweight edges
	reweighted := make(map[int][][2]int)
	for _, e := range edges {
		newWeight := e.weight + int(h[e.src]) - int(h[e.dest])
		reweighted[e.src] = append(reweighted[e.src], [2]int{e.dest, newWeight})
	}

	// Run Dijkstra from each vertex
	result := make(map[int]map[int]float64)
	for u := 0; u < numVertices; u++ {
		dist := dijkstra(numVertices, reweighted, u)
		result[u] = make(map[int]float64)
		for v := 0; v < numVertices; v++ {
			if math.IsInf(dist[v], 1) {
				result[u][v] = math.Inf(1)
			} else {
				result[u][v] = dist[v] - h[u] + h[v]
			}
		}
	}

	return result, true
}

func main() {
	edges := []Edge{
		{0, 1, 1}, {1, 2, 2}, {2, 3, 3}, {0, 3, 10},
	}

	result, ok := johnson(4, edges)
	if !ok {
		fmt.Println("Negative cycle detected")
		return
	}
	fmt.Println("All-pairs shortest distances:")
	for u := 0; u < 4; u++ {
		fmt.Printf("From %d: %v\n", u, result[u])
	}
}
