package longestpalindromicsubsequence

// LongestPalindromicSubsequence returns the length of the longest palindromic subsequence.
func LongestPalindromicSubsequence(arr []int) int {
	n := len(arr)
	if n == 0 { return 0 }
	dp := make([][]int, n)
	for i := range dp { dp[i] = make([]int, n) }
	for i := 0; i < n; i++ { dp[i][i] = 1 }
	for l := 2; l <= n; l++ {
		for i := 0; i <= n-l; i++ {
			j := i + l - 1
			if arr[i] == arr[j] {
				if l == 2 { dp[i][j] = 2 } else { dp[i][j] = dp[i+1][j-1] + 2 }
			} else {
				if dp[i+1][j] > dp[i][j-1] { dp[i][j] = dp[i+1][j] } else { dp[i][j] = dp[i][j-1] }
			}
		}
	}
	return dp[0][n-1]
}
