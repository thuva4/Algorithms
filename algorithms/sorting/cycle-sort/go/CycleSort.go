package main

import "fmt"

func CycleSort(arr []int) []int {
	n := len(arr)

	for cycleStart := 0; cycleStart < n-1; cycleStart++ {
		item := arr[cycleStart]

		// Find the position where we put the item
		pos := cycleStart
		for i := cycleStart + 1; i < n; i++ {
			if arr[i] < item {
				pos++
			}
		}

		// If the item is already in the correct position
		if pos == cycleStart {
			continue
		}

		// Skip duplicates
		for item == arr[pos] {
			pos++
		}

		// Put the item to its correct position
		if pos != cycleStart {
			item, arr[pos] = arr[pos], item
		}

		// Rotate the rest of the cycle
		for pos != cycleStart {
			pos = cycleStart

			for i := cycleStart + 1; i < n; i++ {
				if arr[i] < item {
					pos++
				}
			}

			for item == arr[pos] {
				pos++
			}

			if item != arr[pos] {
				item, arr[pos] = arr[pos], item
			}
		}
	}

	return arr
}

func main() {
	arr := []int{5, 3, 8, 1, 2, -3, 0}
	fmt.Println(CycleSort(arr))
}
