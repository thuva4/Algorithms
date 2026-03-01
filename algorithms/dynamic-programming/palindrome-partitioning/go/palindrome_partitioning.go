package main

import "fmt"

func PalindromePartitioning(arr []int) int {
	n := len(arr)
	if n <= 1 { return 0 }

	isPal := make([][]bool, n)
	for i := range isPal { isPal[i] = make([]bool, n); isPal[i][i] = true }
	for i := 0; i < n-1; i++ { isPal[i][i+1] = arr[i] == arr[i+1] }
	for l := 3; l <= n; l++ {
		for i := 0; i <= n-l; i++ {
			j := i + l - 1
			isPal[i][j] = arr[i] == arr[j] && isPal[i+1][j-1]
		}
	}

	cuts := make([]int, n)
	for i := 0; i < n; i++ {
		if isPal[0][i] { cuts[i] = 0; continue }
		cuts[i] = i
		for j := 1; j <= i; j++ {
			if isPal[j][i] && cuts[j-1]+1 < cuts[i] { cuts[i] = cuts[j-1] + 1 }
		}
	}
	return cuts[n-1]
}

func main() {
	fmt.Println(PalindromePartitioning([]int{1, 2, 1}))
	fmt.Println(PalindromePartitioning([]int{1, 2, 3, 2}))
	fmt.Println(PalindromePartitioning([]int{1, 2, 3}))
	fmt.Println(PalindromePartitioning([]int{5}))
}
