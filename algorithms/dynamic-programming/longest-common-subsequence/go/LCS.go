package main

import "fmt"

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func lcs(x, y string) int {
	m := len(x)
	n := len(y)

	dp := make([][]int, m+1)
	for i := range dp {
		dp[i] = make([]int, n+1)
	}

	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if x[i-1] == y[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else {
				dp[i][j] = max(dp[i-1][j], dp[i][j-1])
			}
		}
	}

	return dp[m][n]
}

func main() {
	fmt.Println(lcs("ABCBDAB", "BDCAB")) // 4
}
