package main

import "fmt"

func mobiusFunction(n int) int {
	if n <= 0 {
		return 0
	}
	mu := make([]int, n+1)
	primes := make([]int, 0, n)
	isComposite := make([]bool, n+1)
	mu[1] = 1

	for i := 2; i <= n; i++ {
		if !isComposite[i] {
			primes = append(primes, i)
			mu[i] = -1
		}
		for _, p := range primes {
			if i*p > n {
				break
			}
			isComposite[i*p] = true
			if i%p == 0 {
				mu[i*p] = 0
				break
			}
			mu[i*p] = -mu[i]
		}
	}

	sum := 1
	for i := 2; i <= n; i++ {
		sum += mu[i]
	}
	return sum
}

func main() {
	fmt.Println(mobiusFunction(1))
	fmt.Println(mobiusFunction(10))
	fmt.Println(mobiusFunction(50))
}
