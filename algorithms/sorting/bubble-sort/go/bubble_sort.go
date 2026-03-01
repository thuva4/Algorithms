package bubblesort

/**
 * BubbleSort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 * It returns a new sorted slice without modifying the original input.
 */
func BubbleSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	// Create a copy of the input slice to avoid modifying it
	result := make([]int, n)
	copy(result, arr)

	for i := 0; i < n-1; i++ {
		// Optimization: track if any swaps occurred in this pass
		swapped := false

		// Last i elements are already in place, so we don't need to check them
		for j := 0; j < n-i-1; j++ {
			if result[j] > result[j+1] {
				// Swap elements if they are in the wrong order
				result[j], result[j+1] = result[j+1], result[j]
				swapped = true
			}
		}

		// If no two elements were swapped by inner loop, then break
		if !swapped {
			break
		}
	}

	return result
}
