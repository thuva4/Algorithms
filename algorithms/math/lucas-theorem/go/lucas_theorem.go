package main

import "fmt"

func modPowLucas(base, exp, mod int64) int64 {
	result := int64(1); base %= mod
	for exp > 0 {
		if exp&1 == 1 { result = result * base % mod }
		exp >>= 1; base = base * base % mod
	}
	return result
}

func lucasTheorem(n, k int64, p int) int {
	if k > n { return 0 }
	pp := int64(p)
	fact := make([]int64, p)
	fact[0] = 1
	for i := 1; i < p; i++ { fact[i] = fact[i-1] * int64(i) % pp }

	result := int64(1)
	for n > 0 || k > 0 {
		ni := int(n % pp); ki := int(k % pp)
		if ki > ni { return 0 }
		c := fact[ni] * modPowLucas(fact[ki], pp-2, pp) % pp
		c = c * modPowLucas(fact[ni-ki], pp-2, pp) % pp
		result = result * c % pp
		n /= pp; k /= pp
	}
	return int(result)
}

func main() {
	fmt.Println(lucasTheorem(10, 3, 7))
	fmt.Println(lucasTheorem(5, 2, 3))
	fmt.Println(lucasTheorem(100, 50, 13))
}
