package main

import ("fmt"; "math")

func GaussianElimination(arr []int) int {
	idx := 0; n := arr[idx]; idx++
	mat := make([][]float64, n)
	for i := 0; i < n; i++ { mat[i] = make([]float64, n+1); for j := 0; j <= n; j++ { mat[i][j] = float64(arr[idx]); idx++ } }
	for col := 0; col < n; col++ {
		maxRow := col
		for row := col+1; row < n; row++ { if math.Abs(mat[row][col]) > math.Abs(mat[maxRow][col]) { maxRow = row } }
		mat[col], mat[maxRow] = mat[maxRow], mat[col]
		for row := col+1; row < n; row++ {
			if mat[col][col] == 0 { continue }
			f := mat[row][col] / mat[col][col]
			for j := col; j <= n; j++ { mat[row][j] -= f * mat[col][j] }
		}
	}
	sol := make([]float64, n)
	for i := n-1; i >= 0; i-- {
		sol[i] = mat[i][n]
		for j := i+1; j < n; j++ { sol[i] -= mat[i][j] * sol[j] }
		sol[i] /= mat[i][i]
	}
	sum := 0.0; for _, s := range sol { sum += s }
	return int(math.Round(sum))
}

func main() {
	fmt.Println(GaussianElimination([]int{2, 1, 1, 3, 2, 1, 4}))
	fmt.Println(GaussianElimination([]int{2, 1, 0, 5, 0, 1, 3}))
	fmt.Println(GaussianElimination([]int{1, 2, 6}))
	fmt.Println(GaussianElimination([]int{3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9}))
}
