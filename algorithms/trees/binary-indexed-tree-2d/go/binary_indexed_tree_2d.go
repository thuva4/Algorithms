package main

import "fmt"

type BIT2D struct {
	tree       [][]int64
	rows, cols int
}

func newBIT2D(rows, cols int) *BIT2D {
	tree := make([][]int64, rows+1)
	for i := range tree { tree[i] = make([]int64, cols+1) }
	return &BIT2D{tree, rows, cols}
}

func (b *BIT2D) update(r, c int, val int64) {
	for i := r + 1; i <= b.rows; i += i & (-i) {
		for j := c + 1; j <= b.cols; j += j & (-j) {
			b.tree[i][j] += val
		}
	}
}

func (b *BIT2D) query(r, c int) int64 {
	var s int64
	for i := r + 1; i > 0; i -= i & (-i) {
		for j := c + 1; j > 0; j -= j & (-j) {
			s += b.tree[i][j]
		}
	}
	return s
}

func main() {
	var rows, cols int
	fmt.Scan(&rows, &cols)
	bit := newBIT2D(rows, cols)
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			var v int; fmt.Scan(&v)
			if v != 0 { bit.update(r, c, int64(v)) }
		}
	}
	var q int; fmt.Scan(&q)
	first := true
	for i := 0; i < q; i++ {
		var t, r, c, v int
		fmt.Scan(&t, &r, &c, &v)
		if t == 1 { bit.update(r, c, int64(v)) } else {
			if !first { fmt.Print(" ") }
			fmt.Print(bit.query(r, c)); first = false
		}
	}
	fmt.Println()
}

func binary_indexed_tree_2d(rows int, cols int, matrix [][]int, operations [][]int) []int {
	bit := newBIT2D(rows, cols)
	for r := 0; r < rows && r < len(matrix); r++ {
		for c := 0; c < cols && c < len(matrix[r]); c++ {
			if matrix[r][c] != 0 {
				bit.update(r, c, int64(matrix[r][c]))
			}
		}
	}

	results := make([]int, 0)
	for _, operation := range operations {
		if len(operation) < 4 {
			continue
		}
		if operation[0] == 1 {
			bit.update(operation[1], operation[2], int64(operation[3]))
		} else if operation[0] == 2 {
			results = append(results, int(bit.query(operation[1], operation[2])))
		}
	}
	return results
}
