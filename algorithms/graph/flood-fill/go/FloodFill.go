package main

import "fmt"

// floodFill fills all connected cells with the same value as (sr, sc) with newValue.
func floodFill(grid [][]int, sr, sc, newValue int) [][]int {
	originalValue := grid[sr][sc]
	if originalValue == newValue {
		return grid
	}

	rows := len(grid)
	cols := len(grid[0])

	var fill func(r, c int)
	fill = func(r, c int) {
		if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != originalValue {
			return
		}
		grid[r][c] = newValue
		fill(r-1, c)
		fill(r+1, c)
		fill(r, c-1)
		fill(r, c+1)
	}

	fill(sr, sc)
	return grid
}

func main() {
	grid := [][]int{
		{1, 1, 1},
		{1, 1, 0},
		{1, 0, 1},
	}

	result := floodFill(grid, 0, 0, 2)
	fmt.Println("After flood fill:")
	for _, row := range result {
		fmt.Println(row)
	}
}
