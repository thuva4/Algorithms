package postmansort

// PostmanSort sorts an array of integers using the Postman Sort algorithm.
func PostmanSort(arr []int) {
	if len(arr) == 0 {
		return
	}

	minVal := getMin(arr)
	offset := 0

	if minVal < 0 {
		offset = -minVal
		for i := range arr {
			arr[i] += offset
		}
	}

	maxVal := getMax(arr)

	for exp := 1; maxVal/exp > 0; exp *= 10 {
		countSort(arr, exp)
	}

	if offset > 0 {
		for i := range arr {
			arr[i] -= offset
		}
	}
}

func getMin(arr []int) int {
	min := arr[0]
	for _, v := range arr {
		if v < min {
			min = v
		}
	}
	return min
}

func getMax(arr []int) int {
	max := arr[0]
	for _, v := range arr {
		if v > max {
			max = v
		}
	}
	return max
}

func countSort(arr []int, exp int) {
	n := len(arr)
	output := make([]int, n)
	count := make([]int, 10)

	for i := 0; i < n; i++ {
		count[(arr[i]/exp)%10]++
	}

	for i := 1; i < 10; i++ {
		count[i] += count[i-1]
	}

	for i := n - 1; i >= 0; i-- {
		output[count[(arr[i]/exp)%10]-1] = arr[i]
		count[(arr[i]/exp)%10]--
	}

	for i := 0; i < n; i++ {
		arr[i] = output[i]
	}
}
