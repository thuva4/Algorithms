package main

import (
	"fmt"
	"math"
)

func maxSubarrayDC(arr []int) int64 {
	return helper(arr, 0, len(arr)-1)
}

func helper(arr []int, lo, hi int) int64 {
	if lo == hi {
		return int64(arr[lo])
	}
	mid := (lo + hi) / 2

	leftSum := int64(math.MinInt64)
	s := int64(0)
	for i := mid; i >= lo; i-- {
		s += int64(arr[i])
		if s > leftSum {
			leftSum = s
		}
	}
	rightSum := int64(math.MinInt64)
	s = 0
	for i := mid + 1; i <= hi; i++ {
		s += int64(arr[i])
		if s > rightSum {
			rightSum = s
		}
	}

	cross := leftSum + rightSum
	leftMax := helper(arr, lo, mid)
	rightMax := helper(arr, mid+1, hi)
	result := leftMax
	if rightMax > result {
		result = rightMax
	}
	if cross > result {
		result = cross
	}
	return result
}

func main() {
	var n int
	fmt.Scan(&n)
	arr := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&arr[i])
	}
	fmt.Println(maxSubarrayDC(arr))
}
