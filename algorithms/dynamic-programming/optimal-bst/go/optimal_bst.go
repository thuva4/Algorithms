package optimalbst

import "math"

func OptimalBST(arr []int) int {
	n := arr[0]
	freq := arr[1 : n+1]

	cost := make([][]int, n)
	for i := range cost {
		cost[i] = make([]int, n)
		cost[i][i] = freq[i]
	}

	for l := 2; l <= n; l++ {
		for i := 0; i <= n-l; i++ {
			j := i + l - 1
			cost[i][j] = math.MaxInt64
			freqSum := 0
			for k := i; k <= j; k++ {
				freqSum += freq[k]
			}

			for r := i; r <= j; r++ {
				left := 0
				if r > i {
					left = cost[i][r-1]
				}
				right := 0
				if r < j {
					right = cost[r+1][j]
				}
				c := left + right + freqSum
				if c < cost[i][j] {
					cost[i][j] = c
				}
			}
		}
	}

	return cost[0][n-1]
}
