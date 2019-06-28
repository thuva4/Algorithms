package search

import "testing"

func TestLinearSearch(t *testing.T) {
	var tests = []struct {
		input  []int
		key    int
		output int
	}{
		{
			input:  []int{1, 2, 3, 4, 5},
			key:    3,
			output: 2,
		},
		{
			input:  []int{-1, 0, 100, 33, 44},
			key:    -2,
			output: -1,
		},
		{
			input:  []int{},
			output: -1,
		},
	}

	for _, test := range tests {
		result := LinearSearch(test.input, test.key)

		if result != test.output {
			t.Errorf("LinearSearch(%v, %v) => %v, want %v",
				test.input, test.key, result, test.output)
		}
	}
}
