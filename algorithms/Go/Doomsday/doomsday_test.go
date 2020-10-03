package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDayOfWeek(t *testing.T) {
	assert.Equal(t, dayOfWeek(1970, 1, 1), 4, "Should be a Thursday")
	assert.Equal(t, dayOfWeek(1111, 11, 11), 6, "Should be a Saturday")
	assert.Equal(t, dayOfWeek(2000, 1, 1), 6, "Should be a Saturday")
}
