package partialsort

import (
	"sort"
)

/**
 * PartialSort implementation.
 * Returns the smallest k elements of the array in sorted order.
 * If k >= len(arr), returns the fully sorted array.
 * It returns a new sorted slice without modifying the original input.
 */
func PartialSort(arr []int, k int) []int {
	if k <= 0 {
		return []int{}
	}
	if k > len(arr) {
		k = len(arr)
	}

	result := make([]int, len(arr))
	copy(result, arr)
	sort.Ints(result)

	return result[:k]
}

func partial_sort(arr []int) []int {
	return PartialSort(arr, len(arr))
}
