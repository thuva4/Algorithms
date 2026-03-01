package exponentialsearch

func ExponentialSearch(arr []int, target int) int {
	n := len(arr)
	if n == 0 {
		return -1
	}
	if arr[0] == target {
		return 0
	}

	i := 1
	for i < n && arr[i] <= target {
		i = i * 2
	}

	return binarySearch(arr, i/2, min(i, n-1), target)
}

func binarySearch(arr []int, l, r, target int) int {
	for l <= r {
		mid := l + (r-l)/2
		if arr[mid] == target {
			return mid
		}
		if arr[mid] < target {
			l = mid + 1
		} else {
			r = mid - 1
		}
	}
	return -1
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
