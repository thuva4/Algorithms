package main

import "fmt"

func fib(n int) int {
	var sequence = make([]int, n + 1, n + 1)
	sequence[0], sequence[1] = 0, 1

	for i := 2; i <= n; i += 1 {
		sequence[i] = sequence[i-1] + sequence[i-2]
	}

	return sequence[n]
}

func main() {
	fmt.Println(fib(10))
}
