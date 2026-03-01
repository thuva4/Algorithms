package dynamicprogramming

func max_1d_range_sum(values []int) int {
	best := 0
	current := 0
	for _, value := range values {
		current += value
		if current < 0 {
			current = 0
		}
		if current > best {
			best = current
		}
	}
	return best
}
