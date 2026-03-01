package eggdrop

import "math"

// EggDrop returns the minimum number of trials for the egg drop problem.
func EggDrop(arr []int) int {
	eggs, floors := arr[0], arr[1]
	dp := make([][]int, eggs+1)
	for i := range dp { dp[i] = make([]int, floors+1) }
	for f := 1; f <= floors; f++ { dp[1][f] = f }
	for e := 2; e <= eggs; e++ {
		for f := 1; f <= floors; f++ {
			dp[e][f] = math.MaxInt32
			for x := 1; x <= f; x++ {
				worst := 1 + max(dp[e-1][x-1], dp[e][f-x])
				if worst < dp[e][f] { dp[e][f] = worst }
			}
		}
	}
	return dp[eggs][floors]
}

func max(a, b int) int { if a > b { return a }; return b }
