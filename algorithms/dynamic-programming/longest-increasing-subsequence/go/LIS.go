package main

import "fmt"

func lis(arr []int) int {
	n := len(arr)
	if n == 0 {
		return 0
	}

	dp := make([]int, n)
	for i := range dp {
		dp[i] = 1
	}

	maxLen := 1
	for i := 1; i < n; i++ {
		for j := 0; j < i; j++ {
			if arr[j] < arr[i] && dp[j]+1 > dp[i] {
				dp[i] = dp[j] + 1
			}
		}
		if dp[i] > maxLen {
			maxLen = dp[i]
		}
	}

	return maxLen
}

func main() {
	arr := []int{10, 9, 2, 5, 3, 7, 101, 18}
	fmt.Println(lis(arr)) // 4
}
