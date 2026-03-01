package main

import "fmt"

func eulerTotientSieve(n int) int64 {
	phi := make([]int, n+1)
	for i := 0; i <= n; i++ {
		phi[i] = i
	}
	for i := 2; i <= n; i++ {
		if phi[i] == i {
			for j := i; j <= n; j += i {
				phi[j] -= phi[j] / i
			}
		}
	}
	var sum int64
	for i := 1; i <= n; i++ {
		sum += int64(phi[i])
	}
	return sum
}

func main() {
	fmt.Println(eulerTotientSieve(1))
	fmt.Println(eulerTotientSieve(10))
	fmt.Println(eulerTotientSieve(100))
}
