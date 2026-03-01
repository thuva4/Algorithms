package main

import "fmt"

func factorial(x int) int {
	product := 1
	for i := 1; i <= x; i++ {
		product *= i
	}
	return product
}

func main() {
	fmt.Printf("0! = %d\n", factorial(0))
	fmt.Printf("1! = %d\n", factorial(1))
	fmt.Printf("2! = %d\n", factorial(2))
	fmt.Printf("3! = %d\n", factorial(3))
	fmt.Printf("4! = %d\n", factorial(4))
	fmt.Printf("5! = %d\n", factorial(5))
	fmt.Printf("6! = %d\n", factorial(6))
}
