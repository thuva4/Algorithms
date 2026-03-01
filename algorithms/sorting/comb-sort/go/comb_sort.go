package combsort

import "math"

/**
 * CombSort implementation.
 * Improves on Bubble Sort by using a gap larger than 1.
 * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
 * It returns a new sorted slice without modifying the original input.
 */
func CombSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	result := make([]int, n)
	copy(result, arr)

	gap := n
	shrink := 1.3
	sorted := false

	for !sorted {
		gap = int(math.Floor(float64(gap) / shrink))
		if gap <= 1 {
			gap = 1
			sorted = true
		}

		for i := 0; i < n-gap; i++ {
			if result[i] > result[i+gap] {
				result[i], result[i+gap] = result[i+gap], result[i]
				sorted = false
			}
		}
	}

	return result
}
