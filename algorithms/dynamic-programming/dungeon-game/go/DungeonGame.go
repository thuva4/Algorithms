package main

import "fmt"

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func abs(a int) int {
	if a < 0 {
		return -a
	}
	return a
}

func dungeonGame(grid [][]int) int {
	m := len(grid)
	if m == 0 {
		return 0
	}
	n := len(grid[0])

	dp := make([][]int, m)
	for i := range dp {
		dp[i] = make([]int, n)
	}

	for i := m - 1; i >= 0; i-- {
		for j := n - 1; j >= 0; j-- {
			if i == m-1 && j == n-1 {
				dp[i][j] = min(0, grid[i][j])
			} else if i == m-1 {
				dp[i][j] = min(0, grid[i][j]+dp[i][j+1])
			} else if j == n-1 {
				dp[i][j] = min(0, grid[i][j]+dp[i+1][j])
			} else {
				dp[i][j] = min(0, grid[i][j]+max(dp[i][j+1], dp[i+1][j]))
			}
		}
	}

	return abs(dp[0][0]) + 1
}

func main() {
	grid := [][]int{
		{-2, -3, 3},
		{-5, -10, 1},
		{10, 30, -5},
	}
	fmt.Println(dungeonGame(grid)) // 7
}
