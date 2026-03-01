package main

import "fmt"

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func rodCut(prices []int, n int) int {
	dp := make([]int, n+1)

	for i := 1; i <= n; i++ {
		for j := 0; j < i; j++ {
			dp[i] = max(dp[i], prices[j]+dp[i-j-1])
		}
	}

	return dp[n]
}

func main() {
	prices := []int{1, 5, 8, 9, 10, 17, 17, 20}
	fmt.Println(rodCut(prices, 8)) // 22
}
