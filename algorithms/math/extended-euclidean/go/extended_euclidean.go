package extendedeuclidean

func extended_gcd(a, b int) (int, int, int) {
	if a == 0 {
		if b < 0 {
			return -b, 0, -1
		}
		return b, 0, 1
	}

	gcd, x1, y1 := extended_gcd(b%a, a)
	x := y1 - (b/a)*x1
	y := x1
	return gcd, x, y
}
