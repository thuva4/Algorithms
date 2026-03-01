package main

import "fmt"

func getMax(arr []int) int {
	max := arr[0]
	for _, v := range arr {
		if v > max {
			max = v
		}
	}
	return max
}

func countingSortByDigit(arr []int, n int, exp int) {
	output := make([]int, n)
	count := make([]int, 10)

	for i := 0; i < n; i++ {
		count[(arr[i]/exp)%10]++
	}

	for i := 1; i < 10; i++ {
		count[i] += count[i-1]
	}

	for i := n - 1; i >= 0; i-- {
		digit := (arr[i] / exp) % 10
		output[count[digit]-1] = arr[i]
		count[digit]--
	}

	copy(arr, output)
}

func RadixSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}

	// Separate negative and non-negative numbers
	var negatives, positives []int
	for _, v := range arr {
		if v < 0 {
			negatives = append(negatives, -v)
		} else {
			positives = append(positives, v)
		}
	}

	// Sort positives
	if len(positives) > 0 {
		max := getMax(positives)
		for exp := 1; max/exp > 0; exp *= 10 {
			countingSortByDigit(positives, len(positives), exp)
		}
	}

	// Sort negatives (sort their absolute values, then reverse)
	if len(negatives) > 0 {
		max := getMax(negatives)
		for exp := 1; max/exp > 0; exp *= 10 {
			countingSortByDigit(negatives, len(negatives), exp)
		}
	}

	// Merge: reversed negatives (largest abs first, then negate) + positives
	idx := 0
	for i := len(negatives) - 1; i >= 0; i-- {
		arr[idx] = -negatives[i]
		idx++
	}
	for _, v := range positives {
		arr[idx] = v
		idx++
	}

	return arr
}

func main() {
	arr := []int{170, 45, 75, -90, 802, 24, 2, 66}
	fmt.Println(RadixSort(arr))
}
