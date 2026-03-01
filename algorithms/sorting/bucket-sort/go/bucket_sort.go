package bucketsort

import (
	"sort"
)

// BucketSort implementation.
// Divides the input into several buckets, each of which is then sorted individually.
// It returns a new sorted slice without modifying the original input.
func BucketSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	minVal, maxVal := arr[0], arr[0]
	for _, x := range arr {
		if x < minVal {
			minVal = x
		}
		if x > maxVal {
			maxVal = x
		}
	}

	if minVal == maxVal {
		return append([]int{}, arr...)
	}

	// Initialize buckets
	buckets := make([][]int, n)
	rangeVal := int64(maxVal) - int64(minVal)

	// Distribute elements into buckets
	for _, x := range arr {
		index := int(int64(x-minVal) * int64(n-1) / rangeVal)
		buckets[index] = append(buckets[index], x)
	}

	// Sort each bucket and merge
	result := make([]int, 0, n)
	for i := 0; i < n; i++ {
		if len(buckets[i]) > 0 {
			sort.Ints(buckets[i])
			result = append(result, buckets[i]...)
		}
	}

	return result
}
