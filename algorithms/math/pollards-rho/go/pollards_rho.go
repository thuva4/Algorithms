package main

import (
	"fmt"
	"math/big"
)

func pollardsRho(n int64) int64 {
	if n <= 1 {
		return n
	}
	bn := big.NewInt(n)
	if bn.ProbablyPrime(20) {
		return n
	}
	// Trial division for small factors
	for p := int64(2); p*p <= n && p < 1000; p++ {
		if n%p == 0 {
			return p
		}
	}
	// Pollard's rho
	smallest := n
	stack := []int64{n}
	for len(stack) > 0 {
		num := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if num <= 1 {
			continue
		}
		bnum := big.NewInt(num)
		if bnum.ProbablyPrime(20) {
			if num < smallest {
				smallest = num
			}
			continue
		}
		d := rhoFactor(num)
		stack = append(stack, d, num/d)
	}
	return smallest
}

func rhoFactor(n int64) int64 {
	if n%2 == 0 {
		return 2
	}
	x, y, c, d := int64(2), int64(2), int64(1), int64(1)
	for d == 1 {
		x = mulmod(x, x, n)
		x = (x + c) % n
		y = mulmod(y, y, n)
		y = (y + c) % n
		y = mulmod(y, y, n)
		y = (y + c) % n
		diff := x - y
		if diff < 0 {
			diff = -diff
		}
		d = gcd64(diff, n)
	}
	if d != n {
		return d
	}
	return n
}

func mulmod(a, b, m int64) int64 {
	ba := big.NewInt(a)
	bb := big.NewInt(b)
	bm := big.NewInt(m)
	ba.Mul(ba, bb)
	ba.Mod(ba, bm)
	return ba.Int64()
}

func gcd64(a, b int64) int64 {
	for b != 0 {
		a, b = b, a%b
	}
	if a < 0 {
		return -a
	}
	return a
}

func main() {
	fmt.Println(pollardsRho(15))
	fmt.Println(pollardsRho(13))
	fmt.Println(pollardsRho(91))
	fmt.Println(pollardsRho(221))
}
