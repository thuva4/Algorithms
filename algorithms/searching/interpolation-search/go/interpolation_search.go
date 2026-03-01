package interpolationsearch

func InterpolationSearch(arr []int, target int) int {
	lo, hi := 0, len(arr)-1
	
	for lo <= hi && target >= arr[lo] && target <= arr[hi] {
		if lo == hi {
			if arr[lo] == target {
				return lo
			}
			return -1
		}
		
		if arr[hi] == arr[lo] {
			if arr[lo] == target {
				return lo
			}
			return -1
		}

		pos := lo + int(float64(hi-lo)/float64(arr[hi]-arr[lo])*float64(target-arr[lo]))

		if arr[pos] == target {
			return pos
		}

		if arr[pos] < target {
			lo = pos + 1
		} else {
			hi = pos - 1
		}
	}
	return -1
}
