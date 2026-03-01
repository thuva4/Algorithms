package main

import (
	"fmt"
	"math/bits"
)

type DisjointSparseTable struct {
	table  [][]int64
	a      []int64
	sz     int
	levels int
}

func newDST(arr []int) *DisjointSparseTable {
	n := len(arr)
	sz := 1
	levels := 0
	for sz < n {
		sz <<= 1
		levels++
	}
	if levels == 0 {
		levels = 1
	}
	a := make([]int64, sz)
	for i := 0; i < n; i++ {
		a[i] = int64(arr[i])
	}
	table := make([][]int64, levels)
	for i := range table {
		table[i] = make([]int64, sz)
	}
	dst := &DisjointSparseTable{table, a, sz, levels}
	dst.build()
	return dst
}

func (dst *DisjointSparseTable) build() {
	for level := 0; level < dst.levels; level++ {
		block := 1 << (level + 1)
		half := block >> 1
		for start := 0; start < dst.sz; start += block {
			mid := start + half
			dst.table[level][mid] = dst.a[mid]
			end := start + block
			if end > dst.sz {
				end = dst.sz
			}
			for i := mid + 1; i < end; i++ {
				dst.table[level][i] = dst.table[level][i-1] + dst.a[i]
			}
			if mid-1 >= start {
				dst.table[level][mid-1] = dst.a[mid-1]
				for i := mid - 2; i >= start; i-- {
					dst.table[level][i] = dst.table[level][i+1] + dst.a[i]
				}
			}
		}
	}
}

func (dst *DisjointSparseTable) query(l, r int) int64 {
	if l == r {
		return dst.a[l]
	}
	level := bits.Len(uint(l^r)) - 1
	return dst.table[level][l] + dst.table[level][r]
}

func main() {
	var n int
	fmt.Scan(&n)
	arr := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&arr[i])
	}
	dst := newDST(arr)
	var q int
	fmt.Scan(&q)
	for i := 0; i < q; i++ {
		var l, r int
		fmt.Scan(&l, &r)
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(dst.query(l, r))
	}
	fmt.Println()
}

func disjoint_sparse_table(n int, array []int, queries [][]int) []int {
	if len(array) == 0 || n == 0 {
		return make([]int, len(queries))
	}
	prefix := make([]int, len(array)+1)
	for i, value := range array {
		prefix[i+1] = prefix[i] + value
	}
	results := make([]int, 0, len(queries))
	for _, query := range queries {
		if len(query) < 2 {
			results = append(results, 0)
			continue
		}
		l := query[0]
		r := query[1]
		if l < 0 {
			l = 0
		}
		if r >= len(array) {
			r = len(array) - 1
		}
		if l > r {
			results = append(results, 0)
			continue
		}
		results = append(results, prefix[r+1]-prefix[l])
	}
	return results
}
