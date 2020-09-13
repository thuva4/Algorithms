package main

import (
	"fmt"
	"math/rand"
)

func shakersort(array []int) {
	swapped := true
	for swapped {

		swapped = false
		for i := 0; i < len(array)-2; i++ {
			if array[i] > array[i+1] {
				array[i], array[i+1] = array[i+1], array[i]
				swapped = true
			}
		}

		if !swapped {
			break
		}

		swapped = false
		for i := len(array) - 2; i >= 0; i-- {
			if array[i] > array[i+1] {
				array[i], array[i+1] = array[i+1], array[i]
				swapped = true
			}
		}
	}
}

func randomArray(n uint64) []int {
	array := make([]int, n)
	for i := range array {
		array[i] = rand.Intn(100)
	}
	return array
}

func main() {
	testArray := randomArray(10)
	fmt.Println(testArray)

	shakersort(testArray)
	fmt.Println(testArray)
}
