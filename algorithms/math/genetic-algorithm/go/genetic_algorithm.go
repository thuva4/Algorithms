package main

import "math/rand"

func GeneticAlgorithm(arr []int, seed int) int {
	if len(arr) == 0 {
		return 0
	}
	if len(arr) == 1 {
		return arr[0]
	}

	n := len(arr)
	rng := rand.New(rand.NewSource(int64(seed)))
	popSize := 20
	if n < popSize {
		popSize = n
	}
	generations := 100
	mutationRate := 0.1

	population := make([]int, popSize)
	for i := 0; i < popSize; i++ {
		population[i] = rng.Intn(n)
	}

	bestIdx := population[0]
	for _, idx := range population {
		if arr[idx] < arr[bestIdx] {
			bestIdx = idx
		}
	}

	for g := 0; g < generations; g++ {
		newPop := make([]int, popSize)
		for i := 0; i < popSize; i++ {
			a := population[rng.Intn(popSize)]
			b := population[rng.Intn(popSize)]
			if arr[a] <= arr[b] {
				newPop[i] = a
			} else {
				newPop[i] = b
			}
		}

		offspring := make([]int, popSize)
		for i := 0; i < popSize-1; i += 2 {
			if rng.Float64() < 0.7 {
				offspring[i] = newPop[i]
				offspring[i+1] = newPop[i+1]
			} else {
				offspring[i] = newPop[i+1]
				offspring[i+1] = newPop[i]
			}
		}
		if popSize%2 != 0 {
			offspring[popSize-1] = newPop[popSize-1]
		}

		for i := 0; i < popSize; i++ {
			if rng.Float64() < mutationRate {
				offspring[i] = rng.Intn(n)
			}
		}

		population = offspring

		for _, idx := range population {
			if arr[idx] < arr[bestIdx] {
				bestIdx = idx
			}
		}
	}

	return arr[bestIdx]
}
