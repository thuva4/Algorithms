package math

// GCDEuclidean
func GCDEuclidean(num1, num2 int) int {
	for num1 != num2 {
		if num1 > num2 {
			num1 -= num2
		} else {
			num2 -= num1
		}
	}

	return num1
}