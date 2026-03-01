package main

import "fmt"

// LevenshteinDistance computes the edit distance between two sequences.
// Input format: [len1, seq1..., len2, seq2...]
// Returns: minimum number of single-element edits
func LevenshteinDistance(arr []int) int {
	idx := 0
	len1 := arr[idx]; idx++
	seq1 := arr[idx : idx+len1]; idx += len1
	len2 := arr[idx]; idx++
	seq2 := arr[idx : idx+len2]

	dp := make([][]int, len1+1)
	for i := range dp {
		dp[i] = make([]int, len2+1)
		dp[i][0] = i
	}
	for j := 0; j <= len2; j++ {
		dp[0][j] = j
	}

	for i := 1; i <= len1; i++ {
		for j := 1; j <= len2; j++ {
			if seq1[i-1] == seq2[j-1] {
				dp[i][j] = dp[i-1][j-1]
			} else {
				m := dp[i-1][j]
				if dp[i][j-1] < m { m = dp[i][j-1] }
				if dp[i-1][j-1] < m { m = dp[i-1][j-1] }
				dp[i][j] = 1 + m
			}
		}
	}

	return dp[len1][len2]
}

func main() {
	fmt.Println(LevenshteinDistance([]int{3, 1, 2, 3, 3, 1, 2, 4})) // 1
	fmt.Println(LevenshteinDistance([]int{2, 5, 6, 2, 5, 6}))       // 0
	fmt.Println(LevenshteinDistance([]int{2, 1, 2, 2, 3, 4}))       // 2
	fmt.Println(LevenshteinDistance([]int{0, 3, 1, 2, 3}))          // 3
}
