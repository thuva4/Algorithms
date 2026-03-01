package main

import (
	"fmt"
	"math"
)

func kdTree(data []int) int {
	n := data[0]
	qx := data[1+2*n]
	qy := data[2+2*n]
	best := math.MaxInt64
	idx := 1
	for i := 0; i < n; i++ {
		dx := data[idx] - qx
		dy := data[idx+1] - qy
		d := dx*dx + dy*dy
		if d < best {
			best = d
		}
		idx += 2
	}
	return best
}

func main() {
	fmt.Println(kdTree([]int{3, 1, 2, 3, 4, 5, 6, 3, 3}))
	fmt.Println(kdTree([]int{2, 0, 0, 5, 5, 0, 0}))
	fmt.Println(kdTree([]int{1, 3, 4, 0, 0}))
}
