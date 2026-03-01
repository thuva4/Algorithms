package main

import (
	"math"
	"math/rand"
)

func SimulatedAnnealing(arr []int) int {
	if len(arr) == 0 {
		return 0
	}
	if len(arr) == 1 {
		return arr[0]
	}

	n := len(arr)
	rng := rand.New(rand.NewSource(42))

	current := 0
	best := 0
	temperature := 1000.0
	coolingRate := 0.995
	minTemp := 0.01

	for temperature > minTemp {
		neighbor := rng.Intn(n)
		delta := arr[neighbor] - arr[current]

		if delta < 0 {
			current = neighbor
		} else {
			probability := math.Exp(-float64(delta) / temperature)
			if rng.Float64() < probability {
				current = neighbor
			}
		}

		if arr[current] < arr[best] {
			best = current
		}

		temperature *= coolingRate
	}

	return arr[best]
}
