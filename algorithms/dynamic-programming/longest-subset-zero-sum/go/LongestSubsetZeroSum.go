package main

import "fmt"

func longestSubsetZeroSum(arr []int) int {
	n := len(arr)
	maxLen := 0

	// Use hash map to store first occurrence of each prefix sum
	sumMap := make(map[int]int)
	sumMap[0] = -1
	sum := 0

	for i := 0; i < n; i++ {
		sum += arr[i]
		if idx, ok := sumMap[sum]; ok {
			length := i - idx
			if length > maxLen {
				maxLen = length
			}
		} else {
			sumMap[sum] = i
		}
	}

	return maxLen
}

func main() {
	arr := []int{1, 2, -3, 3}
	fmt.Println(longestSubsetZeroSum(arr)) // 3
}
