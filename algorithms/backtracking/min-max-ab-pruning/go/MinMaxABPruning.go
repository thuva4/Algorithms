package minmaxab

import "math"

// MinimaxAB implements minimax with alpha-beta pruning.
func MinimaxAB(depth, nodeIndex int, isMax bool, scores []int, h, alpha, beta int) int {
	if depth == h {
		return scores[nodeIndex]
	}

	if isMax {
		bestVal := math.MinInt32
		for _, childIndex := range []int{nodeIndex * 2, nodeIndex*2 + 1} {
			childValue := MinimaxAB(depth+1, childIndex, false, scores, h, alpha, beta)
			if childValue > bestVal {
				bestVal = childValue
			}
			if bestVal > alpha {
				alpha = bestVal
			}
			if beta <= alpha {
				break
			}
		}
		return bestVal
	}

	bestVal := math.MaxInt32
	for _, childIndex := range []int{nodeIndex * 2, nodeIndex*2 + 1} {
		childValue := MinimaxAB(depth+1, childIndex, true, scores, h, alpha, beta)
		if childValue < bestVal {
			bestVal = childValue
		}
		if bestVal < beta {
			beta = bestVal
		}
		if beta <= alpha {
			break
		}
	}
	return bestVal
}

func minimax_ab(treeValues []int, depth int, isMaximizing bool) int {
	if len(treeValues) == 0 {
		return 0
	}
	return MinimaxAB(0, 0, isMaximizing, treeValues, depth, math.MinInt32, math.MaxInt32)
}
