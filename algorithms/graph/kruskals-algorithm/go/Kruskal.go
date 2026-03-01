package main

import (
	"fmt"
	"sort"
)

// Edge represents a weighted undirected edge.
type Edge struct {
	src, dest, weight int
}

// UnionFind structure for Kruskal's algorithm.
type UnionFind struct {
	parent []int
	rank   []int
}

func newUnionFind(n int) *UnionFind {
	uf := &UnionFind{
		parent: make([]int, n),
		rank:   make([]int, n),
	}
	for i := 0; i < n; i++ {
		uf.parent[i] = i
	}
	return uf
}

func (uf *UnionFind) find(x int) int {
	if uf.parent[x] != x {
		uf.parent[x] = uf.find(uf.parent[x])
	}
	return uf.parent[x]
}

func (uf *UnionFind) union(x, y int) bool {
	rootX := uf.find(x)
	rootY := uf.find(y)

	if rootX == rootY {
		return false
	}

	if uf.rank[rootX] < uf.rank[rootY] {
		uf.parent[rootX] = rootY
	} else if uf.rank[rootX] > uf.rank[rootY] {
		uf.parent[rootY] = rootX
	} else {
		uf.parent[rootY] = rootX
		uf.rank[rootX]++
	}
	return true
}

// kruskal finds the MST total weight using Kruskal's algorithm.
func kruskal(numVertices int, edges []Edge) int {
	sort.Slice(edges, func(i, j int) bool {
		return edges[i].weight < edges[j].weight
	})

	uf := newUnionFind(numVertices)
	totalWeight := 0
	edgesUsed := 0

	for _, e := range edges {
		if edgesUsed >= numVertices-1 {
			break
		}
		if uf.union(e.src, e.dest) {
			totalWeight += e.weight
			edgesUsed++
		}
	}

	return totalWeight
}

func main() {
	edges := []Edge{
		{0, 1, 10},
		{0, 2, 6},
		{0, 3, 5},
		{1, 3, 15},
		{2, 3, 4},
	}

	result := kruskal(4, edges)
	fmt.Println("MST total weight:", result)
}
