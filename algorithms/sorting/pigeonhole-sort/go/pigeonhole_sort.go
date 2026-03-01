package pigeonholesort

/**
 * PigeonholeSort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 * It returns a new sorted slice without modifying the original input.
 */
func PigeonholeSort(arr []int) []int {
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
	holes := make([][]int, rangeVal)

	for _, v := range arr {
		holes[v-minVal] = append(holes[v-minVal], v)
	}

	result := make([]int, 0, len(arr))
	for _, hole := range holes {
		result = append(result, hole...)
	}

	return result
}
