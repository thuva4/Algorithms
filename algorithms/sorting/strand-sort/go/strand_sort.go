package strandsort

// StrandSort sorts an array of integers using the Strand Sort algorithm.
func StrandSort(arr []int) {
	if len(arr) <= 1 {
		return
	}

	// Use a slice as a list
	list := make([]int, len(arr))
	copy(list, arr)
	
	var sorted []int

	for len(list) > 0 {
		var strand []int
		strand = append(strand, list[0])
		
		// Remaining list after extracting strand
		var remaining []int
		
		// Start checking from the second element
		for i := 1; i < len(list); i++ {
			if list[i] >= strand[len(strand)-1] {
				strand = append(strand, list[i])
			} else {
				remaining = append(remaining, list[i])
			}
		}
		
		list = remaining
		sorted = merge(sorted, strand)
	}

	copy(arr, sorted)
}

func merge(sorted, strand []int) []int {
	result := make([]int, 0, len(sorted)+len(strand))
	i, j := 0, 0
	
	for i < len(sorted) && j < len(strand) {
		if sorted[i] <= strand[j] {
			result = append(result, sorted[i])
			i++
		} else {
			result = append(result, strand[j])
			j++
		}
	}
	
	for i < len(sorted) {
		result = append(result, sorted[i])
		i++
	}
	for j < len(strand) {
		result = append(result, strand[j])
		j++
	}
	
	return result
}
