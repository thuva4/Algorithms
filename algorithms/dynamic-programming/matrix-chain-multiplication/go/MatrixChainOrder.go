package main

import (
	"fmt"
	"math"
)

// MatrixChainOrder finds the minimum number of scalar multiplications
// needed to compute the chain product of matrices.
// dims is an array where matrix i has dimensions dims[i-1] x dims[i].
func MatrixChainOrder(dims []int) int {
	n := len(dims) - 1 // number of matrices

	if n <= 0 {
		return 0
	}

	m := make([][]int, n)
	for i := range m {
		m[i] = make([]int, n)
	}

	for chainLen := 2; chainLen <= n; chainLen++ {
		for i := 0; i < n-chainLen+1; i++ {
			j := i + chainLen - 1
			m[i][j] = math.MaxInt32
			for k := i; k < j; k++ {
				cost := m[i][k] + m[k+1][j] + dims[i]*dims[k+1]*dims[j+1]
				if cost < m[i][j] {
					m[i][j] = cost
				}
			}
		}
	}

	return m[0][n-1]
}

func main() {
	fmt.Println(MatrixChainOrder([]int{10, 20, 30}))              // 6000
	fmt.Println(MatrixChainOrder([]int{40, 20, 30, 10, 30}))      // 26000
	fmt.Println(MatrixChainOrder([]int{10, 20, 30, 40, 30}))      // 30000
	fmt.Println(MatrixChainOrder([]int{1, 2, 3, 4}))              // 18
	fmt.Println(MatrixChainOrder([]int{5, 10, 3, 12, 5, 50, 6}))  // 2010
}
