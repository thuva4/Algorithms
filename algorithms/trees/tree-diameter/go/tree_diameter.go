package main

import "fmt"

func bfsDiameter(start, n int, adj [][]int) (int, int) {
	dist := make([]int, n)
	for i := range dist { dist[i] = -1 }
	dist[start] = 0
	queue := []int{start}
	farthest := start
	for len(queue) > 0 {
		node := queue[0]; queue = queue[1:]
		for _, nb := range adj[node] {
			if dist[nb] == -1 {
				dist[nb] = dist[node] + 1
				queue = append(queue, nb)
				if dist[nb] > dist[farthest] { farthest = nb }
			}
		}
	}
	return farthest, dist[farthest]
}

func TreeDiameter(arr []int) int {
	idx := 0
	n := arr[idx]; idx++
	if n <= 1 { return 0 }

	adj := make([][]int, n)
	m := (len(arr) - 1) / 2
	for i := 0; i < m; i++ {
		u := arr[idx]; idx++
		v := arr[idx]; idx++
		adj[u] = append(adj[u], v)
		adj[v] = append(adj[v], u)
	}

	u, _ := bfsDiameter(0, n, adj)
	_, diameter := bfsDiameter(u, n, adj)
	return diameter
}

func main() {
	fmt.Println(TreeDiameter([]int{4, 0, 1, 1, 2, 2, 3}))
	fmt.Println(TreeDiameter([]int{5, 0, 1, 0, 2, 0, 3, 0, 4}))
	fmt.Println(TreeDiameter([]int{2, 0, 1}))
	fmt.Println(TreeDiameter([]int{1}))
}
