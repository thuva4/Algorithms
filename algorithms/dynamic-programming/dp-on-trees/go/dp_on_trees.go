package main

import (
	"fmt"
	"math"
)

func dpOnTrees(n int, values []int, edges [][2]int) int {
	if n == 0 {
		return 0
	}
	if n == 1 {
		return values[0]
	}

	adj := make([][]int, n)
	for i := range adj {
		adj[i] = []int{}
	}
	for _, e := range edges {
		adj[e[0]] = append(adj[e[0]], e[1])
		adj[e[1]] = append(adj[e[1]], e[0])
	}

	dp := make([]int, n)
	parent := make([]int, n)
	visited := make([]bool, n)
	for i := range parent {
		parent[i] = -1
	}

	// BFS
	order := make([]int, 0, n)
	queue := []int{0}
	visited[0] = true
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		order = append(order, node)
		for _, child := range adj[node] {
			if !visited[child] {
				visited[child] = true
				parent[child] = node
				queue = append(queue, child)
			}
		}
	}

	for i := len(order) - 1; i >= 0; i-- {
		node := order[i]
		bestChild := 0
		for _, child := range adj[node] {
			if child != parent[node] {
				if dp[child] > bestChild {
					bestChild = dp[child]
				}
			}
		}
		dp[node] = values[node] + bestChild
	}

	ans := math.MinInt64
	for _, v := range dp {
		if v > ans {
			ans = v
		}
	}
	return ans
}

func main() {
	var n int
	fmt.Scan(&n)
	values := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&values[i])
	}
	edges := make([][2]int, n-1)
	for i := 0; i < n-1; i++ {
		fmt.Scan(&edges[i][0], &edges[i][1])
	}
	fmt.Println(dpOnTrees(n, values, edges))
}
