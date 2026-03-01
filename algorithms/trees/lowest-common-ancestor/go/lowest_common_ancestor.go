package main

import "fmt"

func LowestCommonAncestor(arr []int) int {
	idx := 0
	n := arr[idx]; idx++
	root := arr[idx]; idx++

	adj := make([][]int, n)
	for i := 0; i < n-1; i++ {
		u := arr[idx]; idx++
		v := arr[idx]; idx++
		adj[u] = append(adj[u], v)
		adj[v] = append(adj[v], u)
	}
	qa := arr[idx]; idx++
	qb := arr[idx]; idx++

	LOG := 1
	for (1 << LOG) < n { LOG++ }

	depth := make([]int, n)
	up := make([][]int, LOG)
	for k := range up {
		up[k] = make([]int, n)
		for i := range up[k] { up[k][i] = -1 }
	}

	visited := make([]bool, n)
	visited[root] = true
	up[0][root] = root
	queue := []int{root}
	for len(queue) > 0 {
		v := queue[0]; queue = queue[1:]
		for _, u := range adj[v] {
			if !visited[u] {
				visited[u] = true
				depth[u] = depth[v] + 1
				up[0][u] = v
				queue = append(queue, u)
			}
		}
	}

	for k := 1; k < LOG; k++ {
		for v := 0; v < n; v++ {
			up[k][v] = up[k-1][up[k-1][v]]
		}
	}

	a, b := qa, qb
	if depth[a] < depth[b] { a, b = b, a }
	diff := depth[a] - depth[b]
	for k := 0; k < LOG; k++ {
		if (diff>>k)&1 == 1 { a = up[k][a] }
	}
	if a == b { return a }
	for k := LOG - 1; k >= 0; k-- {
		if up[k][a] != up[k][b] { a = up[k][a]; b = up[k][b] }
	}
	return up[0][a]
}

func main() {
	fmt.Println(LowestCommonAncestor([]int{5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2}))
	fmt.Println(LowestCommonAncestor([]int{5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3}))
	fmt.Println(LowestCommonAncestor([]int{3, 0, 0, 1, 0, 2, 2, 2}))
	fmt.Println(LowestCommonAncestor([]int{5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4}))
}
