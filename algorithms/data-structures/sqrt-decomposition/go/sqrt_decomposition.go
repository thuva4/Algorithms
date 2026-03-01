package main

import (
	"fmt"
	"math"
)

type SqrtDecomp struct {
	a       []int
	blocks  []int64
	n       int
	blockSz int
}

func newSqrtDecomp(arr []int) *SqrtDecomp {
	n := len(arr)
	bs := int(math.Sqrt(float64(n)))
	if bs < 1 {
		bs = 1
	}
	nb := (n + bs - 1) / bs
	blocks := make([]int64, nb)
	a := make([]int, n)
	copy(a, arr)
	for i := 0; i < n; i++ {
		blocks[i/bs] += int64(arr[i])
	}
	return &SqrtDecomp{a, blocks, n, bs}
}

func (sd *SqrtDecomp) query(l, r int) int64 {
	var result int64
	bl, br := l/sd.blockSz, r/sd.blockSz
	if bl == br {
		for i := l; i <= r; i++ {
			result += int64(sd.a[i])
		}
	} else {
		for i := l; i < (bl+1)*sd.blockSz; i++ {
			result += int64(sd.a[i])
		}
		for b := bl + 1; b < br; b++ {
			result += sd.blocks[b]
		}
		for i := br * sd.blockSz; i <= r; i++ {
			result += int64(sd.a[i])
		}
	}
	return result
}

func main() {
	var n int
	fmt.Scan(&n)
	arr := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&arr[i])
	}
	sd := newSqrtDecomp(arr)
	var q int
	fmt.Scan(&q)
	for i := 0; i < q; i++ {
		var l, r int
		fmt.Scan(&l, &r)
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(sd.query(l, r))
	}
	fmt.Println()
}

func sqrt_decomposition(n int, array []int, queries [][]int) []int {
	if len(array) == 0 || n == 0 {
		return make([]int, len(queries))
	}
	sd := newSqrtDecomp(array)
	results := make([]int, 0, len(queries))
	for _, query := range queries {
		if len(query) < 2 {
			results = append(results, 0)
			continue
		}
		results = append(results, int(sd.query(query[0], query[1])))
	}
	return results
}
