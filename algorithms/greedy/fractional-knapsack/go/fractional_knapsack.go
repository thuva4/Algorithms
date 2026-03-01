package fractionalknapsack

import "sort"

type item struct{ value, weight int }

// FractionalKnapsack solves the fractional knapsack problem.
func FractionalKnapsack(arr []int) int {
	capacity := arr[0]
	n := arr[1]
	items := make([]item, n)
	idx := 2
	for i := 0; i < n; i++ {
		items[i] = item{arr[idx], arr[idx+1]}
		idx += 2
	}

	sort.Slice(items, func(i, j int) bool {
		return float64(items[i].value)/float64(items[i].weight) > float64(items[j].value)/float64(items[j].weight)
	})

	totalValue := 0.0
	remaining := capacity
	for _, it := range items {
		if remaining <= 0 { break }
		if it.weight <= remaining {
			totalValue += float64(it.value)
			remaining -= it.weight
		} else {
			totalValue += float64(it.value) * float64(remaining) / float64(it.weight)
			remaining = 0
		}
	}
	return int(totalValue * 100)
}
