package main

import "fmt"

func longestBitonicSubsequence(arr []int) int {
	n := len(arr)
	if n == 0 {
		return 0
	}

	lis := make([]int, n)
	lds := make([]int, n)
	for i := range lis {
		lis[i] = 1
		lds[i] = 1
	}

	for i := 1; i < n; i++ {
		for j := 0; j < i; j++ {
			if arr[j] < arr[i] && lis[j]+1 > lis[i] {
				lis[i] = lis[j] + 1
			}
		}
	}

	for i := n - 2; i >= 0; i-- {
		for j := n - 1; j > i; j-- {
			if arr[j] < arr[i] && lds[j]+1 > lds[i] {
				lds[i] = lds[j] + 1
			}
		}
	}

	result := 0
	for i := 0; i < n; i++ {
		val := lis[i] + lds[i] - 1
		if val > result {
			result = val
		}
	}

	return result
}

func main() {
	arr := []int{1, 3, 4, 2, 6, 1}
	fmt.Println(longestBitonicSubsequence(arr)) // 5
}
