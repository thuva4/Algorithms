package linearsearch

// LinearSearch searches for a target value in an array.
// Returns the index of the target if found, otherwise -1.
func LinearSearch(arr []int, target int) int {
	for i, v := range arr {
		if v == target {
			return i
		}
	}
	return -1
}
