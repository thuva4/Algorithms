package minimax

func minimaxAt(treeValues []int, depth int, index int, isMax bool) int {
	if depth == 0 || index >= len(treeValues) {
		return treeValues[index]
	}

	left := minimaxAt(treeValues, depth-1, index*2, !isMax)
	right := minimaxAt(treeValues, depth-1, index*2+1, !isMax)
	if isMax {
		if left > right {
			return left
		}
		return right
	}
	if left < right {
		return left
	}
	return right
}

// Minimax evaluates a complete binary game tree stored in level-order leaf form.
func Minimax(treeValues []int, depth int, isMax bool) int {
	if len(treeValues) == 0 {
		return 0
	}
	if depth <= 0 {
		return treeValues[0]
	}
	return minimaxAt(treeValues, depth, 0, isMax)
}
