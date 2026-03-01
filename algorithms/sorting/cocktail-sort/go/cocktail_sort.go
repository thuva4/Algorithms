package cocktailsort

/**
 * CocktailSort implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 * It returns a new sorted slice without modifying the original input.
 */
func CocktailSort(arr []int) []int {
	n := len(arr)
	if n <= 1 {
		return append([]int{}, arr...)
	}

	result := make([]int, n)
	copy(result, arr)

	start := 0
	end := n - 1
	swapped := true

	for swapped {
		swapped = false

		// Forward pass
		for i := start; i < end; i++ {
			if result[i] > result[i+1] {
				result[i], result[i+1] = result[i+1], result[i]
				swapped = true
			}
		}

		if !swapped {
			break
		}

		swapped = false
		end--

		// Backward pass
		for i := end - 1; i >= start; i-- {
			if result[i] > result[i+1] {
				result[i], result[i+1] = result[i+1], result[i]
				swapped = true
			}
		}

		start++
	}

	return result
}
