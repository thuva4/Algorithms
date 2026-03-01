package main

import "fmt"

// MinimumSpanningTreeBoruvka finds the MST using Boruvka's algorithm.
// Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
// Returns: total weight of the MST
func MinimumSpanningTreeBoruvka(arr []int) int {
	idx := 0
	n := arr[idx]; idx++
	m := arr[idx]; idx++
	eu := make([]int, m)
	ev := make([]int, m)
	ew := make([]int, m)
	for i := 0; i < m; i++ {
		eu[i] = arr[idx]; idx++
		ev[i] = arr[idx]; idx++
		ew[i] = arr[idx]; idx++
	}

	parent := make([]int, n)
	rank := make([]int, n)
	for i := 0; i < n; i++ { parent[i] = i }

	var find func(int) int
	find = func(x int) int {
		for parent[x] != x { parent[x] = parent[parent[x]]; x = parent[x] }
		return x
	}

	unite := func(x, y int) bool {
		rx, ry := find(x), find(y)
		if rx == ry { return false }
		if rank[rx] < rank[ry] { rx, ry = ry, rx }
		parent[ry] = rx
		if rank[rx] == rank[ry] { rank[rx]++ }
		return true
	}

	totalWeight := 0
	numComponents := n

	for numComponents > 1 {
		cheapest := make([]int, n)
		for i := range cheapest { cheapest[i] = -1 }

		for i := 0; i < m; i++ {
			ru, rv := find(eu[i]), find(ev[i])
			if ru == rv { continue }
			if cheapest[ru] == -1 || ew[i] < ew[cheapest[ru]] { cheapest[ru] = i }
			if cheapest[rv] == -1 || ew[i] < ew[cheapest[rv]] { cheapest[rv] = i }
		}

		for node := 0; node < n; node++ {
			if cheapest[node] != -1 {
				if unite(eu[cheapest[node]], ev[cheapest[node]]) {
					totalWeight += ew[cheapest[node]]
					numComponents--
				}
			}
		}
	}

	return totalWeight
}

func main() {
	fmt.Println(MinimumSpanningTreeBoruvka([]int{3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3}))
	fmt.Println(MinimumSpanningTreeBoruvka([]int{4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4}))
	fmt.Println(MinimumSpanningTreeBoruvka([]int{2, 1, 0, 1, 7}))
	fmt.Println(MinimumSpanningTreeBoruvka([]int{4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3}))
}
