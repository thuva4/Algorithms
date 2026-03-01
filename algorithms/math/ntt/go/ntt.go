package main

import "fmt"

const MOD = 998244353
const GROOT = 3

func modPow(base, exp, mod int64) int64 {
	result := int64(1)
	base %= mod
	for exp > 0 {
		if exp&1 == 1 {
			result = result * base % mod
		}
		exp >>= 1
		base = base * base % mod
	}
	return result
}

func nttTransform(a []int64, invert bool) {
	n := len(a)
	for i, j := 1, 0; i < n; i++ {
		bit := n >> 1
		for j&bit != 0 {
			j ^= bit
			bit >>= 1
		}
		j ^= bit
		if i < j {
			a[i], a[j] = a[j], a[i]
		}
	}
	for length := 2; length <= n; length <<= 1 {
		w := modPow(GROOT, (MOD-1)/int64(length), MOD)
		if invert {
			w = modPow(w, MOD-2, MOD)
		}
		half := length / 2
		for i := 0; i < n; i += length {
			wn := int64(1)
			for k := 0; k < half; k++ {
				u := a[i+k]
				v := a[i+k+half] * wn % MOD
				a[i+k] = (u + v) % MOD
				a[i+k+half] = (u - v + MOD) % MOD
				wn = wn * w % MOD
			}
		}
	}
	if invert {
		invN := modPow(int64(n), MOD-2, MOD)
		for i := range a {
			a[i] = a[i] * invN % MOD
		}
	}
}

func ntt(data []int) []int {
	idx := 0
	na := data[idx]; idx++
	a := make([]int64, na)
	for i := 0; i < na; i++ {
		a[i] = (int64(data[idx])%MOD + MOD) % MOD; idx++
	}
	nb := data[idx]; idx++
	b := make([]int64, nb)
	for i := 0; i < nb; i++ {
		b[i] = (int64(data[idx])%MOD + MOD) % MOD; idx++
	}

	resultLen := na + nb - 1
	n := 1
	for n < resultLen {
		n <<= 1
	}

	fa := make([]int64, n)
	fb := make([]int64, n)
	copy(fa, a)
	copy(fb, b)

	nttTransform(fa, false)
	nttTransform(fb, false)
	for i := 0; i < n; i++ {
		fa[i] = fa[i] * fb[i] % MOD
	}
	nttTransform(fa, true)

	result := make([]int, resultLen)
	for i := 0; i < resultLen; i++ {
		result[i] = int(fa[i])
	}
	return result
}

func main() {
	fmt.Println(ntt([]int{2, 1, 2, 2, 3, 4}))
	fmt.Println(ntt([]int{2, 1, 1, 2, 1, 1}))
}
