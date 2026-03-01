package xorswap

// XorSwap swaps two integers using XOR without a temporary variable.
func XorSwap(a, b int) (int, int) {
	if a != b {
		a = a ^ b
		b = a ^ b
		a = a ^ b
	}
	return a, b
}
