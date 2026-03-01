package bogo

import (
	"math/rand"
	"time"
)

// BogoSort implementation.
// Repeatedly shuffles the array until it's sorted.
// WARNING: Highly inefficient for large arrays.
func BogoSort(arr []int) []int {
	if len(arr) <= 1 {
		return append([]int{}, arr...)
	}

	result := make([]int, len(arr))
	copy(result, arr)

	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	for !isSorted(result) {
		r.Shuffle(len(result), func(i, j int) {
			result[i], result[j] = result[j], result[i]
		})
	}

	return result
}

func isSorted(arr []int) bool {
	for i := 0; i < len(arr)-1; i++ {
		if arr[i] > arr[i+1] {
			return false
		}
	}
	return true
}
