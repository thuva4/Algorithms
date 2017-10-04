package bubble-sort

func sort(arr []int) {
	for itemCount := len(arr) - 1; ; itemCount-- {
		swap := false
		for i := 1; i <= itemCount; i++ {
			if arr[i-1] > arr[i] {
				arr[i-1], arr[i] = arr[i], arr[i-1]
				swap = true
			}
		}
		if swap == false {
			break
		}
	}
}