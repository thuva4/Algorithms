package boyermoore

func BoyerMooreSearch(arr []int) int {
	textLen := arr[0]
	patLen := arr[1+textLen]

	if patLen == 0 {
		return 0
	}
	if patLen > textLen {
		return -1
	}

	text := arr[1 : 1+textLen]
	pattern := arr[2+textLen : 2+textLen+patLen]

	badChar := make(map[int]int)
	for i, v := range pattern {
		badChar[v] = i
	}

	s := 0
	for s <= textLen-patLen {
		j := patLen - 1
		for j >= 0 && pattern[j] == text[s+j] {
			j--
		}
		if j < 0 {
			return s
		}
		bc, ok := badChar[text[s+j]]
		if !ok {
			bc = -1
		}
		shift := j - bc
		if shift < 1 {
			shift = 1
		}
		s += shift
	}

	return -1
}
