package gcd

func Gcd(a, b int) int {
	if a == 0 {
		return b
	}

	if b == 0 {
		return a
	}

	pow2 := uint(0)

	for ; ((a | b) & 1) == 0; pow2++ {
		a >>= 1
		b >>= 1
	}

	for (a & 1) == 0 {
		a >>= 1
	}

	for b != 0 {
		for (b & 1) == 0 {
			b >>= 1
		}

		if a > b {
			a, b = b, a
		}

		b -= a
	}

	return a << pow2
}
