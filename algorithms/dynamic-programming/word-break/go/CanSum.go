package main

import "fmt"

// CanSum determines if target can be formed by summing elements
// from arr with repetition allowed.
// Returns 1 if target is achievable, 0 otherwise.
func CanSum(arr []int, target int) int {
	if target == 0 {
		return 1
	}

	dp := make([]bool, target+1)
	dp[0] = true

	for i := 1; i <= target; i++ {
		for _, elem := range arr {
			if elem <= i && dp[i-elem] {
				dp[i] = true
				break
			}
		}
	}

	if dp[target] {
		return 1
	}
	return 0
}

func main() {
	fmt.Println(CanSum([]int{2, 3}, 7))   // 1
	fmt.Println(CanSum([]int{5, 3}, 8))   // 1
	fmt.Println(CanSum([]int{2, 4}, 7))   // 0
	fmt.Println(CanSum([]int{1}, 5))      // 1
	fmt.Println(CanSum([]int{7}, 3))      // 0
}
