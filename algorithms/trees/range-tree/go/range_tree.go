package main

import (
	"fmt"
	"sort"
)

func rangeTree(data []int) int {
	n := data[0]
	points := make([]int, n)
	copy(points, data[1:1+n])
	sort.Ints(points)
	lo, hi := data[1+n], data[2+n]
	left := sort.SearchInts(points, lo)
	right := sort.SearchInts(points, hi+1)
	return right - left
}

func main() {
	fmt.Println(rangeTree([]int{5, 1, 3, 5, 7, 9, 2, 6}))
	fmt.Println(rangeTree([]int{4, 2, 4, 6, 8, 1, 10}))
	fmt.Println(rangeTree([]int{3, 1, 2, 3, 10, 20}))
}
