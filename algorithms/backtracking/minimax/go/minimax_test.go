package minimax

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMinimax(t *testing.T) {
	tests := []struct {
		root     int
		graph    map[int][]int
		scores   map[int]int
		expected int
	}{
		{
			root: 1,
			graph: map[int][]int{
				1: []int{2, 3, 4},
				4: []int{5},
				5: []int{6},
			},
			scores: map[int]int{
				2: -10,
				3: -20,
				6: 20,
			},
			expected: 20,
		},
	}

	for _, u := range tests {
		assert.Equal(t, u.expected, Minimax(u.root, u.graph, u.scores, true))
	}
}
