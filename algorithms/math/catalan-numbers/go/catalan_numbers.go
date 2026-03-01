package catalannumbers

const MOD int64 = 1000000007

func modPow(base, exp, mod int64) int64 {
	result := int64(1)
	base %= mod
	for exp > 0 {
		if exp%2 == 1 {
			result = result * base % mod
		}
		exp /= 2
		base = base * base % mod
	}
	return result
}

func modInv(a, mod int64) int64 {
	return modPow(a, mod-2, mod)
}

func CatalanNumbers(n int) int {
	result := int64(1)
	for i := 1; i <= n; i++ {
		result = result * int64(2*(2*i-1)) % MOD
		result = result * modInv(int64(i+1), MOD) % MOD
	}
	return int(result)
}
