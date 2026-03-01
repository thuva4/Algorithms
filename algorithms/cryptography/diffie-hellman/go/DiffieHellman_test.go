package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDiffiehellman(t *testing.T) {
	ka, kb := diffiehellman()

	assert.Equal(t, ka, kb, "Keys should be the same")
}
