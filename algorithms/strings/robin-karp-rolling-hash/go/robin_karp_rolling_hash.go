package main

import "fmt"

func modpow(base, exp, mod int64) int64 {
	r := int64(1); base %= mod
	for exp > 0 { if exp&1 == 1 { r = r * base % mod }; exp >>= 1; base = base * base % mod }
	return r
}

func RobinKarpRollingHash(arr []int) int {
	idx := 0
	tlen := arr[idx]; idx++
	text := arr[idx:idx+tlen]; idx += tlen
	plen := arr[idx]; idx++
	pattern := arr[idx:idx+plen]
	if plen > tlen { return -1 }

	var BASE, MOD int64 = 31, 1000000007
	var pHash, tHash, power int64 = 0, 0, 1
	for i := 0; i < plen; i++ {
		pHash = (pHash + int64(pattern[i]+1)*power) % MOD
		tHash = (tHash + int64(text[i]+1)*power) % MOD
		if i < plen-1 { power = power * BASE % MOD }
	}

	invBase := modpow(BASE, MOD-2, MOD)

	for i := 0; i <= tlen-plen; i++ {
		if tHash == pHash {
			match := true
			for j := 0; j < plen; j++ { if text[i+j] != pattern[j] { match = false; break } }
			if match { return i }
		}
		if i < tlen-plen {
			tHash = ((tHash - int64(text[i]+1)) % MOD + MOD) % MOD
			tHash = tHash * invBase % MOD
			tHash = (tHash + int64(text[i+plen]+1)*power) % MOD
		}
	}
	return -1
}

func main() {
	fmt.Println(RobinKarpRollingHash([]int{5, 1, 2, 3, 4, 5, 2, 1, 2}))
	fmt.Println(RobinKarpRollingHash([]int{5, 1, 2, 3, 4, 5, 2, 3, 4}))
	fmt.Println(RobinKarpRollingHash([]int{4, 1, 2, 3, 4, 2, 5, 6}))
	fmt.Println(RobinKarpRollingHash([]int{4, 1, 2, 3, 4, 1, 4}))
}
