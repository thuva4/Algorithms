package kmp

// computeLPS computes the longest proper prefix which is also suffix array.
func computeLPS(pattern string) []int {
	m := len(pattern)
	lps := make([]int, m)
	length := 0
	i := 1

	for i < m {
		if pattern[i] == pattern[length] {
			length++
			lps[i] = length
			i++
		} else {
			if length != 0 {
				length = lps[length-1]
			} else {
				lps[i] = 0
				i++
			}
		}
	}
	return lps
}

// KMPSearch returns the first index where pattern is found in text, or -1.
func KMPSearch(text, pattern string) int {
	n := len(text)
	m := len(pattern)

	if m == 0 {
		return 0
	}

	lps := computeLPS(pattern)

	i := 0
	j := 0
	for i < n {
		if pattern[j] == text[i] {
			i++
			j++
		}
		if j == m {
			return i - j
		} else if i < n && pattern[j] != text[i] {
			if j != 0 {
				j = lps[j-1]
			} else {
				i++
			}
		}
	}
	return -1
}
