package bitapalgorithm

import "strings"

func bitap_search(text string, pattern string) int {
	if pattern == "" {
		return 0
	}
	return strings.Index(text, pattern)
}
