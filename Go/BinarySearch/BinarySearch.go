package main

import "fmt"

func main() {
	arr := []int{1, 2, 3, 4, 5}
	fmt.Println(BinarySearch(arr, 5))
}

// Returns -1 If element not found
func BinarySearch(arr []int, k int) int {
	lo, hi, mid := 0, len(arr)-1, 0
	for hi >= lo {
		mid = (lo + hi) / 2
		if arr[mid] == k {
			return mid
		} else if arr[mid] > k {
			hi = mid - 1
		} else {
			lo = mid + 1
		}
	}
	return -1
}
