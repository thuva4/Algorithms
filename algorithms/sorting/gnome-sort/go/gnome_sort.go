package gnomesort

/**
 * GnomeSort implementation.
 * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
 * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
 * It returns a new sorted slice without modifying the original input.
 */
func GnomeSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	result := make([]int, n)
	copy(result, arr)

	index := 0
	for index < n {
		if index == 0 {
			index++
		}
		if result[index] >= result[index-1] {
			index++
		} else {
			result[index], result[index-1] = result[index-1], result[index]
			index--
		}
	}

	return result
}
