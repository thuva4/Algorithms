package millerrabin

func modPow(base, exp, mod int64) int64 {
	result := int64(1)
	base %= mod
	for exp > 0 {
		if exp%2 == 1 {
			result = result * base % mod
		}
		exp /= 2
		base = base * base % mod
	}
	return result
}

func MillerRabin(n int) int {
	if n < 2 {
		return 0
	}
	if n < 4 {
		return 1
	}
	if n%2 == 0 {
		return 0
	}

	r := 0
	d := int64(n - 1)
	for d%2 == 0 {
		r++
		d /= 2
	}

	witnesses := []int64{2, 3, 5, 7}
	for _, a := range witnesses {
		if a >= int64(n) {
			continue
		}

		x := modPow(a, d, int64(n))
		if x == 1 || x == int64(n-1) {
			continue
		}

		found := false
		for i := 0; i < r-1; i++ {
			x = modPow(x, 2, int64(n))
			if x == int64(n-1) {
				found = true
				break
			}
		}

		if !found {
			return 0
		}
	}

	return 1
}
