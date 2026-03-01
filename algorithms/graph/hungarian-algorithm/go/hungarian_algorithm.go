package main

import (
	"fmt"
	"math"
)

// Hungarian solves the assignment problem in O(n^3).
// Returns the assignment (assignment[i] = job for worker i) and total cost.
func Hungarian(cost [][]int) ([]int, int) {
	n := len(cost)
	INF := math.MaxInt32

	u := make([]int, n+1)
	v := make([]int, n+1)
	matchJob := make([]int, n+1)

	for i := 1; i <= n; i++ {
		matchJob[0] = i
		j0 := 0
		dist := make([]int, n+1)
		used := make([]bool, n+1)
		prevJob := make([]int, n+1)

		for j := 0; j <= n; j++ {
			dist[j] = INF
		}

		for {
			used[j0] = true
			w := matchJob[j0]
			delta := INF
			j1 := -1

			for j := 1; j <= n; j++ {
				if !used[j] {
					cur := cost[w-1][j-1] - u[w] - v[j]
					if cur < dist[j] {
						dist[j] = cur
						prevJob[j] = j0
					}
					if dist[j] < delta {
						delta = dist[j]
						j1 = j
					}
				}
			}

			for j := 0; j <= n; j++ {
				if used[j] {
					u[matchJob[j]] += delta
					v[j] -= delta
				} else {
					dist[j] -= delta
				}
			}

			j0 = j1
			if matchJob[j0] == 0 {
				break
			}
		}

		for j0 != 0 {
			matchJob[j0] = matchJob[prevJob[j0]]
			j0 = prevJob[j0]
		}
	}

	assignment := make([]int, n)
	for j := 1; j <= n; j++ {
		assignment[matchJob[j]-1] = j - 1
	}

	totalCost := 0
	for i := 0; i < n; i++ {
		totalCost += cost[i][assignment[i]]
	}

	return assignment, totalCost
}

func main() {
	cost := [][]int{{9, 2, 7}, {6, 4, 3}, {5, 8, 1}}
	assignment, totalCost := Hungarian(cost)
	fmt.Println("Assignment:", assignment)
	fmt.Println("Total cost:", totalCost)
}
