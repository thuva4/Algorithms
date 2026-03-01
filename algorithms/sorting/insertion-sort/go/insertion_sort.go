package insertionsort

/**
 * InsertionSort implementation.
 * Builds the final sorted array (or list) one item at a time.
 * It returns a new sorted slice without modifying the original input.
 */
func InsertionSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	result := make([]int, n)
	copy(result, arr)

	for i := 1; i < n; i++ {
		key := result[i]
		j := i - 1

		for j >= 0 && result[j] > key {
			result[j+1] = result[j]
			j = j - 1
		}
		result[j+1] = key
	}

	return result
}
