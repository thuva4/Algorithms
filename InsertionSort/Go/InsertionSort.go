package main

import "fmt"

func InsertionSort(arr []int) {
	for i, val := range arr {
		j := i - 1
		for j >= 0 && arr[j] > val {
			arr[j+1] = arr[j]
			j = j - 1
		}
		arr[j + 1] = val
	}
}

func main() {
	arr := []int{2, 1, 1, 3}
	InsertionSort(arr)
	fmt.Println(arr)
}
