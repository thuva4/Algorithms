package hammingDistance

func HammingDistance(a, b string) int {
	if len(a) != len(b) {
		panic("The two strings must have equal length")
	}
	aRunes := []rune(a)
	bRunes := []rune(b)
	distance := 0
	for i, r := range aRunes {
		if r != bRunes[i] {
			distance++
		}
	}
	return distance
}
