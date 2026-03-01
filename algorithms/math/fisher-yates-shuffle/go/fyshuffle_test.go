package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestShuffle(t *testing.T) {
	t1 := []int{1, 2, 3, 4, 5, 6, 7, 8, 9}
	r1 := shuffle(t1)
	assert.NotEqual(t, t1, r1, "Arrays should not be the same")

	t2 := []int{3, 2, 5, 4, 5, 2, 9, 6, 9}
	r2 := shuffle(t2)
	assert.NotEqual(t, t2, r2, "Arrays should not be the same")
}
