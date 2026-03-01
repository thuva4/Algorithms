package main

import (
	"fmt"
	"math"
)

func coinChange(coins []int, amount int) int {
	if amount == 0 {
		return 0
	}

	dp := make([]int, amount+1)
	for i := 1; i <= amount; i++ {
		dp[i] = math.MaxInt32
	}

	for i := 1; i <= amount; i++ {
		for _, coin := range coins {
			if coin <= i && dp[i-coin] != math.MaxInt32 {
				val := dp[i-coin] + 1
				if val < dp[i] {
					dp[i] = val
				}
			}
		}
	}

	if dp[amount] == math.MaxInt32 {
		return -1
	}
	return dp[amount]
}

func main() {
	coins := []int{1, 5, 10, 25}
	fmt.Println(coinChange(coins, 30)) // 2
}
