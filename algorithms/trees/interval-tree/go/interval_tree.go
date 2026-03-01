package main

import "fmt"

func intervalTree(data []int) int {
	n := data[0]
	query := data[2*n+1]
	count := 0
	idx := 1
	for i := 0; i < n; i++ {
		lo, hi := data[idx], data[idx+1]
		idx += 2
		if lo <= query && query <= hi {
			count++
		}
	}
	return count
}

func main() {
	fmt.Println(intervalTree([]int{3, 1, 5, 3, 8, 6, 10, 4}))
	fmt.Println(intervalTree([]int{2, 1, 3, 5, 7, 10}))
	fmt.Println(intervalTree([]int{3, 1, 10, 2, 9, 3, 8, 5}))
}
