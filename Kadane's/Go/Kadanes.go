package main

import (
	"fmt"
)

func Max(x, y int64) int64 {
	if x > y {
		return x
	}
	return y
}

func Kadane(arr []int64) int64 {
	var maxSoFar, maxEnding int64 = 0, 0
	for _, x := range arr {
		maxEnding = Max(0, maxEnding + x)
		maxSoFar = Max(maxSoFar, maxEnding)
	}
	return maxSoFar
}

func main() {
	arr := []int64{-2, -3, 4, -1, -2, 1, 5, -3}
	fmt.Printf("Max contiguous sum is %d", Kadane(arr))
}
