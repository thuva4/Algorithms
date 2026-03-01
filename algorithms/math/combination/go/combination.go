package combination

func nCr(n, r int) int {
	if r < 0 || r > n {
		return 0
	}

	k := r
	if n-r < k {
		k = n - r
	}
	if k == 0 {
		return 1
	}

	result := 1
	for i := 1; i <= k; i++ {
		result = result * (n-k+i) / i
	}

	return result
}
