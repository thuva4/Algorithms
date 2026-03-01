package main

import (
	"fmt"
	"math"
	"math/bits"
)

func bitmaskDp(n int, cost [][]int) int {
	total := 1 << n
	dp := make([]int, total)
	for i := range dp {
		dp[i] = math.MaxInt32
	}
	dp[0] = 0

	for mask := 0; mask < total; mask++ {
		if dp[mask] == math.MaxInt32 {
			continue
		}
		worker := bits.OnesCount(uint(mask))
		if worker >= n {
			continue
		}
		for job := 0; job < n; job++ {
			if mask&(1<<job) == 0 {
				newMask := mask | (1 << job)
				val := dp[mask] + cost[worker][job]
				if val < dp[newMask] {
					dp[newMask] = val
				}
			}
		}
	}

	return dp[total-1]
}

func main() {
	var n int
	fmt.Scan(&n)
	cost := make([][]int, n)
	for i := 0; i < n; i++ {
		cost[i] = make([]int, n)
		for j := 0; j < n; j++ {
			fmt.Scan(&cost[i][j])
		}
	}
	fmt.Println(bitmaskDp(n, cost))
}
