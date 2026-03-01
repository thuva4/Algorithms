package main

import "fmt"

// LongestCommonSubstring finds the length of the longest contiguous subarray
// common to both arrays.
func LongestCommonSubstring(arr1 []int, arr2 []int) int {
	n := len(arr1)
	m := len(arr2)
	maxLen := 0

	dp := make([][]int, n+1)
	for i := range dp {
		dp[i] = make([]int, m+1)
	}

	for i := 1; i <= n; i++ {
		for j := 1; j <= m; j++ {
			if arr1[i-1] == arr2[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
				if dp[i][j] > maxLen {
					maxLen = dp[i][j]
				}
			} else {
				dp[i][j] = 0
			}
		}
	}

	return maxLen
}

func main() {
	fmt.Println(LongestCommonSubstring([]int{1, 2, 3, 4, 5}, []int{3, 4, 5, 6, 7}))  // 3
	fmt.Println(LongestCommonSubstring([]int{1, 2, 3}, []int{4, 5, 6}))                // 0
	fmt.Println(LongestCommonSubstring([]int{1, 2, 3, 4}, []int{1, 2, 3, 4}))          // 4
	fmt.Println(LongestCommonSubstring([]int{1}, []int{1}))                             // 1
	fmt.Println(LongestCommonSubstring([]int{1, 2, 3, 2, 1}, []int{3, 2, 1, 4, 7}))   // 3
}
