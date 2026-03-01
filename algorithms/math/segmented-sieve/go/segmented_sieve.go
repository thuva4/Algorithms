package segmentedsieve

import "math"

// segmented_sieve returns all prime numbers in the inclusive range [low, high].
func segmented_sieve(low, high int) []int {
	if high < 2 || high < low {
		return []int{}
	}
	if low < 2 {
		low = 2
	}

	limit := int(math.Sqrt(float64(high)))
	basePrime := make([]bool, limit+1)
	for i := 2; i <= limit; i++ {
		basePrime[i] = true
	}

	basePrimes := make([]int, 0)
	for p := 2; p <= limit; p++ {
		if !basePrime[p] {
			continue
		}
		basePrimes = append(basePrimes, p)
		for multiple := p * p; multiple <= limit; multiple += p {
			basePrime[multiple] = false
		}
	}

	marked := make([]bool, high-low+1)
	for i := range marked {
		marked[i] = true
	}

	for _, p := range basePrimes {
		start := p * p
		if candidate := ((low + p - 1) / p) * p; candidate > start {
			start = candidate
		}
		for value := start; value <= high; value += p {
			marked[value-low] = false
		}
	}

	result := make([]int, 0)
	for i, isPrime := range marked {
		if isPrime {
			result = append(result, low+i)
		}
	}

	return result
}

// SegmentedSieve is an exported alias for segmented_sieve.
func SegmentedSieve(low, high int) []int {
	return segmented_sieve(low, high)
}
