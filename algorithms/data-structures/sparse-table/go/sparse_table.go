package main

import "fmt"

type SparseTable struct {
	table [][]int
	lg    []int
}

func minVal(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func buildSparseTable(arr []int) *SparseTable {
	n := len(arr)
	k := 1
	for (1 << k) <= n {
		k++
	}
	table := make([][]int, k)
	for j := 0; j < k; j++ {
		table[j] = make([]int, n)
	}
	copy(table[0], arr)
	lg := make([]int, n+1)
	for i := 2; i <= n; i++ {
		lg[i] = lg[i/2] + 1
	}
	for j := 1; j < k; j++ {
		for i := 0; i+(1<<j) <= n; i++ {
			table[j][i] = minVal(table[j-1][i], table[j-1][i+(1<<(j-1))])
		}
	}
	return &SparseTable{table, lg}
}

func (st *SparseTable) query(l, r int) int {
	k := st.lg[r-l+1]
	return minVal(st.table[k][l], st.table[k][r-(1<<k)+1])
}

func main() {
	var n int
	fmt.Scan(&n)
	arr := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&arr[i])
	}
	st := buildSparseTable(arr)
	var q int
	fmt.Scan(&q)
	for i := 0; i < q; i++ {
		var l, r int
		fmt.Scan(&l, &r)
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(st.query(l, r))
	}
	fmt.Println()
}

func sparse_table(n int, array []int, queries [][]int) []int {
	if len(array) == 0 || n == 0 {
		return make([]int, len(queries))
	}
	st := buildSparseTable(array)
	results := make([]int, 0, len(queries))
	for _, query := range queries {
		if len(query) < 2 {
			results = append(results, 0)
			continue
		}
		results = append(results, st.query(query[0], query[1]))
	}
	return results
}
