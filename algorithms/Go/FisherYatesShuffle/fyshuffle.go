package main

import (
	"fmt"
	"math/rand"
)

func shuffle(array []int) {
	for i := len(array) - 1; i >= 1; i-- {
		j := rand.Intn(i + 1)
		array[i], array[j] = array[j], array[i]
	}
}

func main() {
	array := []int{1, 2, 3, 4, 5, 6, 7, 8, 9}
	shuffle(array)
	fmt.Println(array)
}
