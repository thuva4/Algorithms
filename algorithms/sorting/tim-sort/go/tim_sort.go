package timsort

const RUN = 32

func TimSort(arr []int) {
	n := len(arr)
	for i := 0; i < n; i += RUN {
		insertionSort(arr, i, min((i+RUN-1), (n-1)))
	}

	for size := RUN; size < n; size = 2 * size {
		for left := 0; left < n; left += 2 * size {
			mid := left + size - 1
			right := min((left + 2*size - 1), (n - 1))

			if mid < right {
				merge(arr, left, mid, right)
			}
		}
	}
}

func insertionSort(arr []int, left, right int) {
	for i := left + 1; i <= right; i++ {
		temp := arr[i]
		j := i - 1
		for j >= left && arr[j] > temp {
			arr[j+1] = arr[j]
			j--
		}
		arr[j+1] = temp
	}
}

func merge(arr []int, l, m, r int) {
	len1 := m - l + 1
	len2 := r - m
	left := make([]int, len1)
	right := make([]int, len2)

	for i := 0; i < len1; i++ {
		left[i] = arr[l+i]
	}
	for i := 0; i < len2; i++ {
		right[i] = arr[m+1+i]
	}

	i, j, k := 0, 0, l

	for i < len1 && j < len2 {
		if left[i] <= right[j] {
			arr[k] = left[i]
			i++
		} else {
			arr[k] = right[j]
			j++
		}
		k++
	}

	for i < len1 {
		arr[k] = left[i]
		k++
		i++
	}

	for j < len2 {
		arr[k] = right[j]
		k++
		j++
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
