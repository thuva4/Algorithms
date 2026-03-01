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
	if len(arr) == 0 {
		return 0
	}
	maxSoFar, maxEnding := arr[0], arr[0]
	for _, x := range arr[1:] {
		maxEnding = Max(x, maxEnding+x)
		maxSoFar = Max(maxSoFar, maxEnding)
	}
	return maxSoFar
}

func main() {
	arr := []int64{-2, -3, 4, -1, -2, 1, 5, -3}
	fmt.Printf("Max contiguous sum is %d", Kadane(arr))
}
