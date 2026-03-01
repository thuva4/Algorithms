package selectionsort

// SelectionSort sorts an array of integers using the Selection Sort algorithm.
func SelectionSort(arr []int) {
	n := len(arr)
	for i := 0; i < n-1; i++ {
		min_idx := i
		for j := i + 1; j < n; j++ {
			if arr[j] < arr[min_idx] {
				min_idx = j
			}
		}
		arr[i], arr[min_idx] = arr[min_idx], arr[i]
	}
}
