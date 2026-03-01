package main

import "fmt"

const gapCost = 4
const mismatchCost = 3

func min(a, b, c int) int {
	m := a
	if b < m {
		m = b
	}
	if c < m {
		m = c
	}
	return m
}

func sequenceAlignment(s1, s2 string) int {
	m := len(s1)
	n := len(s2)

	dp := make([][]int, m+1)
	for i := range dp {
		dp[i] = make([]int, n+1)
		dp[i][0] = i * gapCost
	}
	for j := 0; j <= n; j++ {
		dp[0][j] = j * gapCost
	}

	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			matchCost := 0
			if s1[i-1] != s2[j-1] {
				matchCost = mismatchCost
			}
			dp[i][j] = min(
				dp[i-1][j-1]+matchCost,
				dp[i-1][j]+gapCost,
				dp[i][j-1]+gapCost,
			)
		}
	}

	return dp[m][n]
}

func main() {
	fmt.Println(sequenceAlignment("GCCCTAGCG", "GCGCAATG")) // 18
}
