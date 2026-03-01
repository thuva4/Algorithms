package modifiedbinarysearch

func ModifiedBinarySearch(arr []int, target int) int {
	if len(arr) == 0 {
		return -1
	}

	start := 0
	end := len(arr) - 1

	isAscending := arr[start] <= arr[end]

	for start <= end {
		mid := start + (end-start)/2

		if arr[mid] == target {
			return mid
		}

		if isAscending {
			if target < arr[mid] {
				end = mid - 1
			} else {
				start = mid + 1
			}
		} else {
			if target > arr[mid] {
				end = mid - 1
			} else {
				start = mid + 1
			}
		}
	}
	return -1
}
