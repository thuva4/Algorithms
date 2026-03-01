package main

import "fmt"

func ropeDataStructure(data []int) int {
	n1 := data[0]
	arr1 := data[1 : 1+n1]
	pos := 1 + n1
	n2 := data[pos]
	arr2 := data[pos+1 : pos+1+n2]
	queryIndex := data[pos+1+n2]

	if queryIndex < n1 {
		return arr1[queryIndex]
	}
	return arr2[queryIndex-n1]
}

func main() {
	fmt.Println(ropeDataStructure([]int{3, 1, 2, 3, 2, 4, 5, 0}))
	fmt.Println(ropeDataStructure([]int{3, 1, 2, 3, 2, 4, 5, 4}))
	fmt.Println(ropeDataStructure([]int{3, 1, 2, 3, 2, 4, 5, 3}))
}
