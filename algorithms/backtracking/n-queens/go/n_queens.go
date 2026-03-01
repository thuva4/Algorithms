package nqueens

// NQueens returns the number of distinct solutions to the N-Queens problem.
func NQueens(n int) int {
	if n <= 0 {
		return 0
	}

	cols := make(map[int]bool)
	diags := make(map[int]bool)
	antiDiags := make(map[int]bool)
	count := 0

	var backtrack func(row int)
	backtrack = func(row int) {
		if row == n {
			count++
			return
		}
		for col := 0; col < n; col++ {
			if cols[col] || diags[row-col] || antiDiags[row+col] {
				continue
			}
			cols[col] = true
			diags[row-col] = true
			antiDiags[row+col] = true
			backtrack(row + 1)
			delete(cols, col)
			delete(diags, row-col)
			delete(antiDiags, row+col)
		}
	}

	backtrack(0)
	return count
}
