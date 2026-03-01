package jumpsearch

import "math"

func JumpSearch(arr []int, target int) int {
	n := len(arr)
	if n == 0 {
		return -1
	}

	step := int(math.Sqrt(float64(n)))
	prev := 0

	for arr[min(step, n)-1] < target {
		prev = step
		step += int(math.Sqrt(float64(n)))
		if prev >= n {
			return -1
		}
	}

	for arr[prev] < target {
		prev++
		if prev == min(step, n) {
			return -1
		}
	}

	if arr[prev] == target {
		return prev
	}

	return -1
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
