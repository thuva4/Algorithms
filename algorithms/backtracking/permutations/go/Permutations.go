package permutations

import "sort"

// Permutations returns all permutations of the given array, sorted lexicographically.
func Permutations(arr []int) [][]int {
	var result [][]int
	if len(arr) == 0 {
		return [][]int{{}}
	}
	var backtrack func(current []int, remaining []int)
	backtrack = func(current []int, remaining []int) {
		if len(remaining) == 0 {
			perm := make([]int, len(current))
			copy(perm, current)
			result = append(result, perm)
			return
		}
		for i := 0; i < len(remaining); i++ {
			newCurrent := append(current, remaining[i])
			newRemaining := make([]int, 0, len(remaining)-1)
			newRemaining = append(newRemaining, remaining[:i]...)
			newRemaining = append(newRemaining, remaining[i+1:]...)
			backtrack(newCurrent, newRemaining)
		}
	}
	backtrack([]int{}, arr)

	sort.Slice(result, func(i, j int) bool {
		for k := 0; k < len(result[i]); k++ {
			if result[i][k] != result[j][k] {
				return result[i][k] < result[j][k]
			}
		}
		return false
	})
	return result
}
