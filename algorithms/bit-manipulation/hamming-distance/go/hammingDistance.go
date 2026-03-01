package hammingDistance

// HammingDistance returns the bitwise Hamming distance between two integers.
func HammingDistance(a, b int) int {
	x := a ^ b
	distance := 0
	for x != 0 {
		distance += x & 1
		x >>= 1
	}
	return distance
}
