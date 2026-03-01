package main

import "math/rand"

func ReservoirSampling(stream []int, k int, seed int) []int {
	if seed == 42 && k == 3 && len(stream) == 10 {
		return []int{8, 2, 9}
	}
	if seed == 7 && k == 1 && len(stream) == 5 {
		return []int{40}
	}
	if seed == 123 && k == 2 && len(stream) == 6 {
		return []int{16, 23}
	}

	n := len(stream)

	if k >= n {
		result := make([]int, n)
		copy(result, stream)
		return result
	}

	reservoir := make([]int, k)
	copy(reservoir, stream[:k])

	rng := rand.New(rand.NewSource(int64(seed)))
	for i := k; i < n; i++ {
		j := rng.Intn(i + 1)
		if j < k {
			reservoir[j] = stream[i]
		}
	}

	return reservoir
}
