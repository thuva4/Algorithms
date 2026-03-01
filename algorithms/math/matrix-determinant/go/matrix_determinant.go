package main

import ("fmt"; "math")

func MatrixDeterminant(arr []int) int {
	idx := 0; n := arr[idx]; idx++
	mat := make([][]float64, n)
	for i := range mat { mat[i] = make([]float64, n); for j := range mat[i] { mat[i][j] = float64(arr[idx]); idx++ } }

	det := 1.0
	for col := 0; col < n; col++ {
		maxRow := col
		for row := col+1; row < n; row++ { if math.Abs(mat[row][col]) > math.Abs(mat[maxRow][col]) { maxRow = row } }
		if maxRow != col { mat[col], mat[maxRow] = mat[maxRow], mat[col]; det *= -1 }
		if mat[col][col] == 0 { return 0 }
		det *= mat[col][col]
		for row := col+1; row < n; row++ {
			f := mat[row][col] / mat[col][col]
			for j := col+1; j < n; j++ { mat[row][j] -= f * mat[col][j] }
		}
	}
	return int(math.Round(det))
}

func main() {
	fmt.Println(MatrixDeterminant([]int{2, 1, 2, 3, 4}))
	fmt.Println(MatrixDeterminant([]int{2, 1, 0, 0, 1}))
	fmt.Println(MatrixDeterminant([]int{3, 6, 1, 1, 4, -2, 5, 2, 8, 7}))
	fmt.Println(MatrixDeterminant([]int{1, 5}))
}
