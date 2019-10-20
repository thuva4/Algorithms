package bf

import (
	"errors"
)

/*
	Given a graph and a source vertex src in graph,
	find shortest paths from src to all vertices in the given graph.
	The graph may contain negative weight edges.
	Time complexity of Bellman-Ford is O(VE), where V = nodes, E = edges
*/

var (
	// ErrNegativeCycleFound indicates cycle is found
	ErrNegativeCycleFound = errors.New("negative cycle found")
)

// Graph interface for graph with Nodes and Edges
type Graph interface {
	Cardinality() int
	Nodes() map[int]Node
	Edges() map[int][]Edge
}

// Node interface for a node in graph with integer ID()
type Node interface {
	ID() int
}

// Edge interface for an edge in graph with Weight(),
// Head() gives the ID() of node pointed to by the edge
type Edge interface {
	Head() int
	Weight() float64
}

type graph struct {
	edges map[int][]Edge
	nodes map[int]Node
}

func (g *graph) Cardinality() int {
	return len(g.nodes)
}

func (g *graph) Nodes() map[int]Node {
	return g.nodes
}

func (g *graph) Edges() map[int][]Edge {
	return g.edges
}

type node struct {
	id int
}

func (n *node) ID() int {
	return n.id
}

type edge struct {
	head   int
	weight float64
}

func (e *edge) Head() int {
	return e.head
}

func (e *edge) Weight() float64 {
	return e.weight
}

// BellmanFord returns the shortest distance to all nodes,
// given the integer ID src of the source node.
func BellmanFord(g Graph, src int) (map[int]float64, error) {

	dist := map[int]float64{}

	dist[src] = 0

	nodes := g.Nodes()
	n := len(nodes)
	nodeIDs := []int{}
	for k := range nodes {
		nodeIDs = append(nodeIDs, k)
	}

	edges := g.Edges()

	// iterating |V|-1 times, ensuring paths with maximum |V|-1 edges
	for i := 1; i < n; i++ {
		for _, u := range nodeIDs {
			udist, ok := dist[u]
			if !ok {
				continue
			}

			for _, e := range edges[u] {
				v := e.Head()
				w := e.Weight()
				vdist, ok := dist[v]
				if !ok {
					dist[v] = udist + w
					continue
				}

				if vdist > udist+w {
					dist[v] = udist + w
				}
			}
		}
	}

	// looking for negative cycle
	valid := true

	for _, u := range nodeIDs {
		udist, ok := dist[u]
		if !ok {
			continue
		}

		for _, e := range edges[u] {
			v := e.Head()
			w := e.Weight()
			vdist, ok := dist[v]
			if !ok {
				valid = false
				break
			}

			if vdist > udist+w {
				valid = false
				break
			}
		}
	}

	if !valid {
		return nil, ErrNegativeCycleFound
	}

	return dist, nil
}
