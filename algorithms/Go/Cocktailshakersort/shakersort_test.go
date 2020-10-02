package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestShakersort(t *testing.T) {
	testArray := []int{5, 4, 6, 8, 1, 9, 4, 7, 3}
	expected := []int{1, 3, 4, 4, 5, 6, 7, 8, 9}

	shakersort(testArray)
	assert.Equal(t, testArray, expected, "Arrays should be the same")
}
