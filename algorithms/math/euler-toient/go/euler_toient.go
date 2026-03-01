package eulertoient

// euler_totient returns the count of integers up to n that are coprime with n.
func euler_totient(n int) int {
	if n <= 0 {
		return 0
	}
	if n == 1 {
		return 1
	}

	result := n
	value := n
	for factor := 2; factor*factor <= value; factor++ {
		if value%factor == 0 {
			for value%factor == 0 {
				value /= factor
			}
			result -= result / factor
		}
	}
	if value > 1 {
		result -= result / value
	}

	return result
}

// EulerTotient is an exported alias for euler_totient.
func EulerTotient(n int) int {
	return euler_totient(n)
}
