package main

import "fmt"

func WildcardMatching(arr []int) int {
	idx := 0
	tlen := arr[idx]; idx++
	text := arr[idx : idx+tlen]; idx += tlen
	plen := arr[idx]; idx++
	pattern := arr[idx : idx+plen]

	dp := make([][]bool, tlen+1)
	for i := range dp { dp[i] = make([]bool, plen+1) }
	dp[0][0] = true
	for j := 1; j <= plen; j++ {
		if pattern[j-1] == 0 { dp[0][j] = dp[0][j-1] }
	}
	for i := 1; i <= tlen; i++ {
		for j := 1; j <= plen; j++ {
			if pattern[j-1] == 0 { dp[i][j] = dp[i-1][j] || dp[i][j-1]
			} else if pattern[j-1] == -1 || pattern[j-1] == text[i-1] { dp[i][j] = dp[i-1][j-1] }
		}
	}
	if dp[tlen][plen] { return 1 }
	return 0
}

func main() {
	fmt.Println(WildcardMatching([]int{3, 1, 2, 3, 3, 1, 2, 3}))
	fmt.Println(WildcardMatching([]int{3, 1, 2, 3, 1, 0}))
	fmt.Println(WildcardMatching([]int{3, 1, 2, 3, 3, 1, -1, 3}))
	fmt.Println(WildcardMatching([]int{2, 1, 2, 2, 3, 4}))
	fmt.Println(WildcardMatching([]int{0, 1, 0}))
}
