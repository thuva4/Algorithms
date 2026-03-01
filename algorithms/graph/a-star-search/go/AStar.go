package main

import (
	"container/heap"
	"fmt"
	"math"
)

// Item represents a node in the priority queue.
type Item struct {
	node    int
	fScore  float64
	index   int
}

type PriorityQueue []*Item

func (pq PriorityQueue) Len() int            { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool   { return pq[i].fScore < pq[j].fScore }
func (pq PriorityQueue) Swap(i, j int)        { pq[i], pq[j] = pq[j], pq[i]; pq[i].index = i; pq[j].index = j }
func (pq *PriorityQueue) Push(x interface{})   { item := x.(*Item); item.index = len(*pq); *pq = append(*pq, item) }
func (pq *PriorityQueue) Pop() interface{}     { old := *pq; n := len(old); item := old[n-1]; *pq = old[:n-1]; return item }

// AStarResult holds the path and cost.
type AStarResult struct {
	Path []int
	Cost float64
}

// aStar performs A* search from start to goal.
func aStar(adjList map[int][][2]int, start, goal int, heuristic map[int]int) AStarResult {
	if start == goal {
		return AStarResult{Path: []int{start}, Cost: 0}
	}

	gScore := make(map[int]float64)
	cameFrom := make(map[int]int)
	closedSet := make(map[int]bool)

	for node := range adjList {
		gScore[node] = math.Inf(1)
	}
	gScore[start] = 0

	pq := &PriorityQueue{}
	heap.Init(pq)
	heap.Push(pq, &Item{node: start, fScore: float64(heuristic[start])})

	for _, node := range []int{start} {
		cameFrom[node] = -1
		_ = node
	}
	cameFrom[start] = -1

	for pq.Len() > 0 {
		current := heap.Pop(pq).(*Item).node

		if current == goal {
			// Reconstruct path
			path := []int{}
			node := goal
			for node != -1 {
				path = append([]int{node}, path...)
				prev, exists := cameFrom[node]
				if !exists || prev == -1 {
					if node == start {
						break
					}
					node = prev
					break
				}
				node = prev
			}
			return AStarResult{Path: path, Cost: gScore[goal]}
		}

		if closedSet[current] {
			continue
		}
		closedSet[current] = true

		for _, edge := range adjList[current] {
			neighbor, weight := edge[0], edge[1]
			if closedSet[neighbor] {
				continue
			}

			tentativeG := gScore[current] + float64(weight)
			if tentativeG < gScore[neighbor] {
				cameFrom[neighbor] = current
				gScore[neighbor] = tentativeG
				fScore := tentativeG + float64(heuristic[neighbor])
				heap.Push(pq, &Item{node: neighbor, fScore: fScore})
			}
		}
	}

	return AStarResult{Path: []int{}, Cost: math.Inf(1)}
}

func main() {
	adjList := map[int][][2]int{
		0: {{1, 1}, {2, 4}},
		1: {{2, 2}, {3, 6}},
		2: {{3, 3}},
		3: {},
	}
	heuristic := map[int]int{0: 5, 1: 4, 2: 2, 3: 0}

	result := aStar(adjList, 0, 3, heuristic)
	fmt.Printf("Path: %v, Cost: %v\n", result.Path, result.Cost)
}
