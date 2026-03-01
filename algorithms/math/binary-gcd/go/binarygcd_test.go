package gcd

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGcd(t *testing.T) {

	tests := []struct {
		a, b, expected int
	}{
		{
			a:        6,
			b:        3,
			expected: 3,
		},
		{
			a:        3,
			b:        4,
			expected: 1,
		},
		{
			a:        12,
			b:        18,
			expected: 6,
		},
	}

	for _, u := range tests {
		g := Gcd(u.a, u.b)
		assert.Equal(t, g, u.expected)
	}

}
