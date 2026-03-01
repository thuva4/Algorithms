package sudokusolver

// SudokuSolve solves a Sudoku puzzle represented as a flat slice of 81 integers.
// Empty cells are represented by 0. Returns the solved board or nil if unsolvable.
func SudokuSolve(board []int) []int {
	grid := make([]int, 81)
	copy(grid, board)

	if solve(grid) {
		return grid
	}
	return nil
}

func isValid(grid []int, pos int, num int) bool {
	row := pos / 9
	col := pos % 9

	// Check row
	for c := 0; c < 9; c++ {
		if grid[row*9+c] == num {
			return false
		}
	}

	// Check column
	for r := 0; r < 9; r++ {
		if grid[r*9+col] == num {
			return false
		}
	}

	// Check 3x3 box
	boxRow := 3 * (row / 3)
	boxCol := 3 * (col / 3)
	for r := boxRow; r < boxRow+3; r++ {
		for c := boxCol; c < boxCol+3; c++ {
			if grid[r*9+c] == num {
				return false
			}
		}
	}

	return true
}

func solve(grid []int) bool {
	for i := 0; i < 81; i++ {
		if grid[i] == 0 {
			for num := 1; num <= 9; num++ {
				if isValid(grid, i, num) {
					grid[i] = num
					if solve(grid) {
						return true
					}
					grid[i] = 0
				}
			}
			return false
		}
	}
	return true
}
