package fibonaccisearch

func FibonacciSearch(arr []int, target int) int {
	n := len(arr)
	if n == 0 {
		return -1
	}

	fibMMm2 := 0
	fibMMm1 := 1
	fibM := fibMMm2 + fibMMm1

	for fibM < n {
		fibMMm2 = fibMMm1
		fibMMm1 = fibM
		fibM = fibMMm2 + fibMMm1
	}

	offset := -1

	for fibM > 1 {
		i := min(offset+fibMMm2, n-1)

		if arr[i] < target {
			fibM = fibMMm1
			fibMMm1 = fibMMm2
			fibMMm2 = fibM - fibMMm1
			offset = i
		} else if arr[i] > target {
			fibM = fibMMm2
			fibMMm1 = fibMMm1 - fibMMm2
			fibMMm2 = fibM - fibMMm1
		} else {
			return i
		}
	}

	if fibMMm1 == 1 && offset+1 < n && arr[offset+1] == target {
		return offset + 1
	}

	return -1
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
