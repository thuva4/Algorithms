package main

import "fmt"

//Implements floodfill
func floodFill(x int, y int, oldVal int, newVal int, area [][]int) {
	if area[y][x] == oldVal {
		area[y][x] = newVal

		floodFill(x, y+1, oldVal, newVal, area)
		floodFill(x, y-1, oldVal, newVal, area)
		floodFill(x+1, y, oldVal, newVal, area)
		floodFill(x-1, y, oldVal, newVal, area)
	}
}

//Print in multiple lines instead of one
//when calling fmt.Println(area)
//Better visibility
func printArea(area [][]int) {
	for i := range area {
		fmt.Println(area[i])
	}
}

func main() {
	area := [][]int{
		{0, 0, 0, 0, 0, 0, 0},
		{0, 1, 1, 1, 1, 1, 0},
		{0, 1, 0, 0, 0, 1, 0},
		{0, 1, 0, 0, 0, 1, 0},
		{0, 1, 0, 0, 0, 1, 0},
		{0, 1, 1, 1, 1, 1, 0},
		{0, 0, 0, 0, 0, 0, 0},
	}
	printArea(area)

	floodFill(3, 3, 0, 5, area)
	fmt.Println()
	printArea(area)
}
