package rabinkarp

const prime = 101
const base = 256

// RabinKarpSearch returns the first index where pattern is found in text, or -1.
func RabinKarpSearch(text, pattern string) int {
	n := len(text)
	m := len(pattern)

	if m == 0 {
		return 0
	}
	if m > n {
		return -1
	}

	var patHash, txtHash, h int64
	h = 1

	for i := 0; i < m-1; i++ {
		h = (h * base) % prime
	}

	for i := 0; i < m; i++ {
		patHash = (base*patHash + int64(pattern[i])) % prime
		txtHash = (base*txtHash + int64(text[i])) % prime
	}

	for i := 0; i <= n-m; i++ {
		if patHash == txtHash {
			match := true
			for j := 0; j < m; j++ {
				if text[i+j] != pattern[j] {
					match = false
					break
				}
			}
			if match {
				return i
			}
		}
		if i < n-m {
			txtHash = (base*(txtHash-int64(text[i])*h) + int64(text[i+m])) % prime
			if txtHash < 0 {
				txtHash += prime
			}
		}
	}
	return -1
}
