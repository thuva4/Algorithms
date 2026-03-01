package pancakesort

/**
 * PancakeSort implementation.
 * Sorts the array by repeatedly flipping subarrays.
 * It returns a new sorted slice without modifying the original input.
 */
func PancakeSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	result := make([]int, n)
	copy(result, arr)

	for currSize := n; currSize > 1; currSize-- {
		mi := findMax(result, currSize)

		if mi != currSize-1 {
			flip(result, mi)
			flip(result, currSize-1)
		}
	}

	return result
}

func flip(arr []int, k int) {
	i := 0
	for i < k {
		arr[i], arr[k] = arr[k], arr[i]
		i++
		k--
	}
}

func findMax(arr []int, n int) int {
	mi := 0
	for i := 0; i < n; i++ {
		if arr[i] > arr[mi] {
			mi = i
		}
	}
	return mi
}
