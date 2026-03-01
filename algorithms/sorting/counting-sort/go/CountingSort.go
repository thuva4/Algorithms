package main

import "fmt"

func CountingSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}

	min, max := arr[0], arr[0]
	for _, v := range arr {
		if v < min {
			min = v
		}
		if v > max {
			max = v
		}
	}

	rangeSize := max - min + 1
	count := make([]int, rangeSize)
	output := make([]int, len(arr))

	for _, v := range arr {
		count[v-min]++
	}

	for i := 1; i < rangeSize; i++ {
		count[i] += count[i-1]
	}

	for i := len(arr) - 1; i >= 0; i-- {
		output[count[arr[i]-min]-1] = arr[i]
		count[arr[i]-min]--
	}

	copy(arr, output)
	return arr
}

func main() {
	arr := []int{5, 3, 8, 1, 2, -3, 0}
	fmt.Println(CountingSort(arr))
}
