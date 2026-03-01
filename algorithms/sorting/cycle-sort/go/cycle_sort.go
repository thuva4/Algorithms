package cyclesort

/**
 * CycleSort implementation.
 * An in-place, unstable sorting algorithm that is optimal in terms of
 * the number of writes to the original array.
 * It returns a new sorted slice without modifying the original input.
 */
func CycleSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	result := make([]int, n)
	copy(result, arr)

	for cycleStart := 0; cycleStart <= n-2; cycleStart++ {
		item := result[cycleStart]

		pos := cycleStart
		for i := cycleStart + 1; i < n; i++ {
			if result[i] < item {
				pos++
			}
		}

		if pos == cycleStart {
			continue
		}

		for item == result[pos] {
			pos++
		}

		if pos != cycleStart {
			result[pos], item = item, result[pos]
		}

		for pos != cycleStart {
			pos = cycleStart
			for i := cycleStart + 1; i < n; i++ {
				if result[i] < item {
					pos++
				}
			}

			for item == result[pos] {
				pos++
			}

			if item != result[pos] {
				result[pos], item = item, result[pos]
			}
		}
	}

	return result
}
