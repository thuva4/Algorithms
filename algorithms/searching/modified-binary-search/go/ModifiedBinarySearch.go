package main

func ModifiedBinarySearch(arr []int, target int) int {
	low := 0
	high := len(arr) - 1
	result := -1

	for low <= high {
		mid := low + (high-low)/2
		if arr[mid] == target {
			result = mid
			high = mid - 1
		} else if arr[mid] < target {
			low = mid + 1
		} else {
			high = mid - 1
		}
	}

	return result
}

func main() {}
