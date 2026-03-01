package main

import "fmt"

func knuthOptimization(n int, freq []int) int {
	dp := make([][]int, n)
	opt := make([][]int, n)
	prefix := make([]int, n+1)
	for i := 0; i < n; i++ {
		dp[i] = make([]int, n)
		opt[i] = make([]int, n)
		prefix[i+1] = prefix[i] + freq[i]
	}

	for i := 0; i < n; i++ {
		dp[i][i] = freq[i]
		opt[i][i] = i
	}

	for length := 2; length <= n; length++ {
		for i := 0; i <= n-length; i++ {
			j := i + length - 1
			dp[i][j] = 1<<31 - 1
			costSum := prefix[j+1] - prefix[i]
			lo := opt[i][j-1]
			hi := j
			if i+1 <= j {
				hi = opt[i+1][j]
			}
			for k := lo; k <= hi; k++ {
				left := 0
				if k > i {
					left = dp[i][k-1]
				}
				right := 0
				if k < j {
					right = dp[k+1][j]
				}
				val := left + right + costSum
				if val < dp[i][j] {
					dp[i][j] = val
					opt[i][j] = k
				}
			}
		}
	}
	return dp[0][n-1]
}

func main() {
	var n int
	fmt.Scan(&n)
	freq := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&freq[i])
	}
	fmt.Println(knuthOptimization(n, freq))
}
