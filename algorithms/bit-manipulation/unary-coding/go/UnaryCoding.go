package unarycoding

import "strings"

// UnaryEncode encodes an integer n into unary representation.
func UnaryEncode(n int) string {
	return strings.Repeat("1", n) + "0"
}
