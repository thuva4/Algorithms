package quickselect

func QuickSelect(arr []int, k int) int {
	return kthSmallest(arr, 0, len(arr)-1, k)
}

func kthSmallest(arr []int, l, r, k int) int {
	if k > 0 && k <= r-l+1 {
		pos := partition(arr, l, r)

		if pos-l == k-1 {
			return arr[pos]
		}
		if pos-l > k-1 {
			return kthSmallest(arr, l, pos-1, k)
		}
		return kthSmallest(arr, pos+1, r, k-pos+l-1)
	}
	return -1
}

func partition(arr []int, l, r int) int {
	x := arr[r]
	i := l
	for j := l; j <= r-1; j++ {
		if arr[j] <= x {
			arr[i], arr[j] = arr[j], arr[i]
			i++
		}
	}
	arr[i], arr[r] = arr[r], arr[i]
	return i
}
