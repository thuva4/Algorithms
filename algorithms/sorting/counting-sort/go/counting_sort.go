package countingsort

/**
 * CountingSort implementation.
 * Efficient for sorting integers with a known small range.
 * It returns a new sorted slice without modifying the original input.
 */
func CountingSort(arr []int) []int {
	if len(arr) == 0 {
		return []int{}
	}

	minVal, maxVal := arr[0], arr[0]
	for _, v := range arr {
		if v < minVal {
			minVal = v
		}
		if v > maxVal {
			maxVal = v
		}
	}

	rangeVal := maxVal - minVal + 1
	count := make([]int, rangeVal)
	output := make([]int, len(arr))

	for _, v := range arr {
		count[v-minVal]++
	}

	for i := 1; i < len(count); i++ {
		count[i] += count[i-1]
	}

	for i := len(arr) - 1; i >= 0; i-- {
		output[count[arr[i]-minVal]-1] = arr[i]
		count[arr[i]-minVal]--
	}

	return output
}
