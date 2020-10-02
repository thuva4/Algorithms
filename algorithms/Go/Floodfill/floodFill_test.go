package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFloodFill(t *testing.T) {
	test := [][]int{
		{0, 0, 0, 0, 0, 0, 0},
		{0, 1, 1, 1, 1, 1, 0},
		{0, 1, 0, 0, 0, 1, 0},
		{0, 1, 0, 0, 0, 1, 0},
		{0, 1, 0, 0, 0, 1, 0},
		{0, 1, 1, 1, 1, 1, 0},
		{0, 0, 0, 0, 0, 0, 0},
	}
	expected := [][]int{
		{0, 0, 0, 0, 0, 0, 0},
		{0, 1, 1, 1, 1, 1, 0},
		{0, 1, 5, 5, 5, 1, 0},
		{0, 1, 5, 5, 5, 1, 0},
		{0, 1, 5, 5, 5, 1, 0},
		{0, 1, 1, 1, 1, 1, 0},
		{0, 0, 0, 0, 0, 0, 0},
	}

	floodFill(3, 3, 0, 5, test)
	assert.Equal(t, test, expected, "Areas should be the same")
}
