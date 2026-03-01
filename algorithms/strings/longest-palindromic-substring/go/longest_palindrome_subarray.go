package longestpalindromicsubstring

func LongestPalindromeSubarray(arr []int) int {
	n := len(arr)
	if n == 0 {
		return 0
	}

	expand := func(l, r int) int {
		for l >= 0 && r < n && arr[l] == arr[r] {
			l--
			r++
		}
		return r - l - 1
	}

	maxLen := 1
	for i := 0; i < n; i++ {
		odd := expand(i, i)
		even := expand(i, i+1)
		if odd > maxLen {
			maxLen = odd
		}
		if even > maxLen {
			maxLen = even
		}
	}
	return maxLen
}
