package hamiltonianpath

// HamiltonianPath returns 1 if a Hamiltonian path exists, 0 otherwise.
func HamiltonianPath(arr []int) int {
	n, m := arr[0], arr[1]
	if n <= 1 { return 1 }
	adj := make([][]bool, n)
	for i := range adj { adj[i] = make([]bool, n) }
	for i := 0; i < m; i++ {
		u, v := arr[2+2*i], arr[3+2*i]
		adj[u][v] = true; adj[v][u] = true
	}
	full := (1 << uint(n)) - 1
	dp := make([][]bool, 1<<uint(n))
	for i := range dp { dp[i] = make([]bool, n) }
	for i := 0; i < n; i++ { dp[1<<uint(i)][i] = true }
	for mask := 1; mask <= full; mask++ {
		for i := 0; i < n; i++ {
			if !dp[mask][i] { continue }
			for j := 0; j < n; j++ {
				if mask&(1<<uint(j)) == 0 && adj[i][j] {
					dp[mask|(1<<uint(j))][j] = true
				}
			}
		}
	}
	for i := 0; i < n; i++ { if dp[full][i] { return 1 } }
	return 0
}
