package math

// GCDEuclidean
func GCDEuclidean(num1, num2 int) int {
	if num1 == 0 {
		return num2
	}
	if num2 == 0 {
		return num1
	}
	for num1 != num2 {
		if num1 > num2 {
			num1 -= num2
		} else {
			num2 -= num1
		}
	}

	return num1
}

func Gcd(num1, num2 int) int {
	return GCDEuclidean(num1, num2)
}
