package main

import "fmt"

func BubbleSort(arr[] int)[]int {
	for i:=1; i< len(arr); i++ {
		for j:=0; j < len(arr)-i; j++ {
			if (arr[j] > arr[j+1]) {
				arr[j], arr[j+1] = arr[j+1], arr[j]
			}
		}
	}
	return arr
}


func main() {
	var bubble []int = []int{21,123,32,4,5,677,8,33}
	fmt.Println("----------------Bubblesort----------------")
	fmt.Println(BubbleSort(bubble))
}