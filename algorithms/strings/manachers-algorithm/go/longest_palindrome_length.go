package manachersalgorithm

func LongestPalindromeLength(arr []int) int {
	if len(arr) == 0 {
		return 0
	}

	t := []int{-1}
	for _, x := range arr {
		t = append(t, x, -1)
	}

	n := len(t)
	p := make([]int, n)
	c, r, maxLen := 0, 0, 0

	for i := 0; i < n; i++ {
		mirror := 2*c - i
		if i < r {
			p[i] = r - i
			if mirror >= 0 && p[mirror] < p[i] {
				p[i] = p[mirror]
			}
		}
		for i+p[i]+1 < n && i-p[i]-1 >= 0 && t[i+p[i]+1] == t[i-p[i]-1] {
			p[i]++
		}
		if i+p[i] > r {
			c = i
			r = i + p[i]
		}
		if p[i] > maxLen {
			maxLen = p[i]
		}
	}

	return maxLen
}
