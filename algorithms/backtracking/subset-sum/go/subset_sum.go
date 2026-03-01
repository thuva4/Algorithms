package subsetsum

// SubsetSum returns 1 if any subset of arr sums to target, 0 otherwise.
func SubsetSum(arr []int, target int) int {
	if backtrack(arr, 0, target) {
		return 1
	}
	return 0
}

func backtrack(arr []int, index int, remaining int) bool {
	if remaining == 0 {
		return true
	}
	if index >= len(arr) {
		return false
	}
	// Include arr[index]
	if backtrack(arr, index+1, remaining-arr[index]) {
		return true
	}
	// Exclude arr[index]
	if backtrack(arr, index+1, remaining) {
		return true
	}
	return false
}
