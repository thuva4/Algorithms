package minimax

// Minimax for games with binary actions at each node
// graph[nodeID] contains the next game states v from game state nodeID
func Minimax(nodeID int, graph map[int][]int, scores map[int]int, isMax bool) int {

	if isMax {
		// return max

		fnd := false
		ret := 0

		for _, v := range graph[nodeID] {
			cur := Minimax(v, graph, scores, false)
			if !fnd {
				ret = cur
				fnd = true
			}

			if cur > ret {
				ret = cur
			}
		}

		if !fnd {
			// leaf node of game graph
			ret = scores[nodeID]
		}

		return ret
	}

	// return min
	fnd := false
	ret := 0

	for _, v := range graph[nodeID] {
		cur := Minimax(v, graph, scores, false)
		if !fnd {
			ret = cur
			fnd = true
		}

		if cur < ret {
			ret = cur
		}
	}

	if !fnd {
		// leaf node of game graph
		ret = scores[nodeID]
	}

	return ret
}
