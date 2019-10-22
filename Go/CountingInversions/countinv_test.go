package countinv

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCountInversions(t *testing.T) {

	tests := []struct {
		arr      []int
		expected int
	}{
		{
			arr:      []int{1, 20, 6, 4, 5},
			expected: 5,
		},
		{
			arr:      []int{2, 4, 1, 3, 5},
			expected: 3,
		},
		{
			arr:      []int{1},
			expected: 0,
		},
		{
			arr:      []int{},
			expected: 0,
		},
		{
			arr:      []int{1, 2},
			expected: 0,
		},
	}

	for _, u := range tests {
		assert.Equal(t, CountInversions(u.arr), u.expected)
	}
}
