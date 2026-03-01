package travellingsalesman

import "math"

// TravellingSalesman returns minimum cost Hamiltonian cycle using bitmask DP.
func TravellingSalesman(arr []int) int {
	n := arr[0]
	if n <= 1 { return 0 }
	dist := make([][]int, n)
	for i := 0; i < n; i++ {
		dist[i] = make([]int, n)
		for j := 0; j < n; j++ {
			dist[i][j] = arr[1+i*n+j]
		}
	}
	INF := math.MaxInt32 / 2
	full := (1 << uint(n)) - 1
	dp := make([][]int, 1<<uint(n))
	for i := range dp {
		dp[i] = make([]int, n)
		for j := range dp[i] { dp[i][j] = INF }
	}
	dp[1][0] = 0
	for mask := 1; mask <= full; mask++ {
		for i := 0; i < n; i++ {
			if dp[mask][i] >= INF || mask&(1<<uint(i)) == 0 { continue }
			for j := 0; j < n; j++ {
				if mask&(1<<uint(j)) != 0 { continue }
				nm := mask | (1 << uint(j))
				cost := dp[mask][i] + dist[i][j]
				if cost < dp[nm][j] { dp[nm][j] = cost }
			}
		}
	}
	result := INF
	for i := 0; i < n; i++ {
		v := dp[full][i] + dist[i][0]
		if v < result { result = v }
	}
	return result
}
