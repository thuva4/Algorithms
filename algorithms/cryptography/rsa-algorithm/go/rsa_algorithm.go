package main

import (
	"fmt"
	"math/big"
)

func rsaAlgorithm(p, q, e, message int64) int64 {
	n := p * q
	phi := (p - 1) * (q - 1)

	bE := big.NewInt(e)
	bPhi := big.NewInt(phi)
	bN := big.NewInt(n)

	d := new(big.Int).ModInverse(bE, bPhi)
	cipher := new(big.Int).Exp(big.NewInt(message), bE, bN)
	plain := new(big.Int).Exp(cipher, d, bN)
	return plain.Int64()
}

func main() {
	fmt.Println(rsaAlgorithm(61, 53, 17, 65))
	fmt.Println(rsaAlgorithm(61, 53, 17, 42))
	fmt.Println(rsaAlgorithm(11, 13, 7, 9))
}
