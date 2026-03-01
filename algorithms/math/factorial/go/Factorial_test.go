package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFactorial(t *testing.T) {
	assert.Equal(t, factorial(5), 120, "")
	assert.Equal(t, factorial(6), 720, "")
	assert.Equal(t, factorial(7), 5040, "")
	assert.Equal(t, factorial(8), 40320, "")
	assert.Equal(t, factorial(9), 362880, "")
}
