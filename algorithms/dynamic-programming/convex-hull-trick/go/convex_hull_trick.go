package main

import (
	"fmt"
	"sort"
)

type Line struct {
	m, b int64
}

func bad(l1, l2, l3 Line) bool {
	return float64(l3.b-l1.b)*float64(l1.m-l2.m) <=
		float64(l2.b-l1.b)*float64(l1.m-l3.m)
}

func convexHullTrick(lines []Line, queries []int64) []int64 {
	sort.Slice(lines, func(i, j int) bool { return lines[i].m < lines[j].m })
	hull := []Line{}
	for _, l := range lines {
		for len(hull) >= 2 && bad(hull[len(hull)-2], hull[len(hull)-1], l) {
			hull = hull[:len(hull)-1]
		}
		hull = append(hull, l)
	}

	results := make([]int64, len(queries))
	for i, x := range queries {
		lo, hi := 0, len(hull)-1
		for lo < hi {
			mid := (lo + hi) / 2
			if hull[mid].m*x+hull[mid].b <= hull[mid+1].m*x+hull[mid+1].b {
				hi = mid
			} else {
				lo = mid + 1
			}
		}
		results[i] = hull[lo].m*x + hull[lo].b
	}
	return results
}

func main() {
	var n int
	fmt.Scan(&n)
	lines := make([]Line, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&lines[i].m, &lines[i].b)
	}
	var q int
	fmt.Scan(&q)
	queries := make([]int64, q)
	for i := 0; i < q; i++ {
		fmt.Scan(&queries[i])
	}
	results := convexHullTrick(lines, queries)
	for i, v := range results {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(v)
	}
	fmt.Println()
}

func convex_hull_trick(n int, rawLines [][]int, rawQueries []int) []int {
	results := make([]int, len(rawQueries))
	for i, x := range rawQueries {
		best := 0
		first := true
		for _, line := range rawLines {
			if len(line) < 2 {
				continue
			}
			value := line[0]*x + line[1]
			if first || value < best {
				best = value
				first = false
			}
		}
		results[i] = best
	}
	return results
}
