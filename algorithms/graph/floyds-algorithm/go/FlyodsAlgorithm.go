package main

import "math"

func floydWarshall(matrix [][]float64) [][]float64 {
	n := len(matrix)
	dist := make([][]float64, n)
	for i := 0; i < n; i++ {
		dist[i] = make([]float64, n)
		copy(dist[i], matrix[i])
	}

	for k := 0; k < n; k++ {
		for i := 0; i < n; i++ {
			for j := 0; j < n; j++ {
				if math.IsInf(dist[i][k], 1) || math.IsInf(dist[k][j], 1) {
					continue
				}
				if candidate := dist[i][k] + dist[k][j]; candidate < dist[i][j] {
					dist[i][j] = candidate
				}
			}
		}
	}

	return dist
}
