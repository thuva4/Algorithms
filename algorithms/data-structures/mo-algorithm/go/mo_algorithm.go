package main

import (
	"fmt"
	"math"
	"sort"
)

func moAlgorithm(n int, arr []int, queries [][2]int) []int64 {
	q := len(queries)
	block := int(math.Max(1, math.Sqrt(float64(n))))
	order := make([]int, q)
	for i := range order {
		order[i] = i
	}
	sort.Slice(order, func(i, j int) bool {
		bi, bj := queries[order[i]][0]/block, queries[order[j]][0]/block
		if bi != bj {
			return bi < bj
		}
		if bi%2 == 0 {
			return queries[order[i]][1] < queries[order[j]][1]
		}
		return queries[order[i]][1] > queries[order[j]][1]
	})

	results := make([]int64, q)
	curL, curR := 0, -1
	var curSum int64
	for _, idx := range order {
		l, r := queries[idx][0], queries[idx][1]
		for curR < r {
			curR++
			curSum += int64(arr[curR])
		}
		for curL > l {
			curL--
			curSum += int64(arr[curL])
		}
		for curR > r {
			curSum -= int64(arr[curR])
			curR--
		}
		for curL < l {
			curSum -= int64(arr[curL])
			curL++
		}
		results[idx] = curSum
	}
	return results
}

func main() {
	var n int
	fmt.Scan(&n)
	arr := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&arr[i])
	}
	var q int
	fmt.Scan(&q)
	queries := make([][2]int, q)
	for i := 0; i < q; i++ {
		fmt.Scan(&queries[i][0], &queries[i][1])
	}
	results := moAlgorithm(n, arr, queries)
	for i, v := range results {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(v)
	}
	fmt.Println()
}
