package bitonic

import (
	"math"
)

// BitonicSort implementation.
// Works on any array size by padding to the nearest power of 2.
func BitonicSort(arr []int) []int {
	if len(arr) == 0 {
		return []int{}
	}

	n := len(arr)
	nextPow2 := 1
	for nextPow2 < n {
		nextPow2 *= 2
	}

	// Pad the array to the next power of 2
	// We use math.MaxInt for padding to handle ascending sort
	padded := make([]int, nextPow2)
	for i := 0; i < n; i++ {
		padded[i] = arr[i]
	}
	for i := n; i < nextPow2; i++ {
		padded[i] = math.MaxInt
	}

	bitonicSortRecursive(padded, 0, nextPow2, true)

	// Return the first n elements (trimmed back to original size)
	result := make([]int, n)
	copy(result, padded[:n])
	return result
}

func compareAndSwap(arr []int, i, j int, ascending bool) {
	if (ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j]) {
		arr[i], arr[j] = arr[j], arr[i]
	}
}

func bitonicMerge(arr []int, low, cnt int, ascending bool) {
	if cnt > 1 {
		k := cnt / 2
		for i := low; i < low+k; i++ {
			compareAndSwap(arr, i, i+k, ascending)
		}
		bitonicMerge(arr, low, k, ascending)
		bitonicMerge(arr, low+k, k, ascending)
	}
}

func bitonicSortRecursive(arr []int, low, cnt int, ascending bool) {
	if cnt > 1 {
		k := cnt / 2
		// Sort first half in ascending order
		bitonicSortRecursive(arr, low, k, true)
		// Sort second half in descending order
		bitonicSortRecursive(arr, low+k, k, false)
		// Merge the whole sequence in given order
		bitonicMerge(arr, low, cnt, ascending)
	}
}
