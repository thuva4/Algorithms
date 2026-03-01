package ratinamaze

// RatInMaze returns 1 if a path exists from (0,0) to (n-1,n-1), 0 otherwise.
func RatInMaze(arr []int) int {
	n := arr[0]
	grid := make([][]int, n)
	idx := 1
	for i := 0; i < n; i++ {
		grid[i] = make([]int, n)
		for j := 0; j < n; j++ {
			grid[i][j] = arr[idx]; idx++
		}
	}
	if grid[0][0] == 0 || grid[n-1][n-1] == 0 { return 0 }
	visited := make([][]bool, n)
	for i := range visited { visited[i] = make([]bool, n) }

	var solve func(r, c int) bool
	solve = func(r, c int) bool {
		if r == n-1 && c == n-1 { return true }
		if r < 0 || r >= n || c < 0 || c >= n || grid[r][c] == 0 || visited[r][c] { return false }
		visited[r][c] = true
		if solve(r+1, c) || solve(r, c+1) { return true }
		visited[r][c] = false
		return false
	}

	if solve(0, 0) { return 1 }
	return 0
}
