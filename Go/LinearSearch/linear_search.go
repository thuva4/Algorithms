package search

// LinearSearch returns the index of the given key found on the list.
// It returns a value of -1 if the key doesn't exist
func LinearSearch(list []int, key int) int {
	for index, element := range list {
		if key == element {
			return index
		}
	}

	return -1
}
