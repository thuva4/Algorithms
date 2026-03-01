package main

import "fmt"

func discreteLogarithm(base, target, modulus int64) int {
	if modulus <= 1 {
		return 0
	}

	target %= modulus
	value := int64(1 % modulus)
	for exponent := 0; exponent < int(modulus); exponent++ {
		if value == target {
			return exponent
		}
		value = (value * (base % modulus)) % modulus
	}
	return -1
}

func main() {
	fmt.Println(discreteLogarithm(2, 8, 13))
	fmt.Println(discreteLogarithm(5, 1, 7))
	fmt.Println(discreteLogarithm(3, 3, 11))
	fmt.Println(discreteLogarithm(3, 13, 17))
}
