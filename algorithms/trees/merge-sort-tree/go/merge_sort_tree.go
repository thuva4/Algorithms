package main

import (
	"fmt"
	"sort"
)

type MergeSortTree struct {
	tree [][]int
	n    int
}

func newMST(arr []int) *MergeSortTree {
	n := len(arr)
	mst := &MergeSortTree{make([][]int, 4*n), n}
	mst.build(arr, 1, 0, n-1)
	return mst
}

func (mst *MergeSortTree) build(a []int, nd, s, e int) {
	if s == e { mst.tree[nd] = []int{a[s]}; return }
	m := (s + e) / 2
	mst.build(a, 2*nd, s, m); mst.build(a, 2*nd+1, m+1, e)
	mst.tree[nd] = mergeSorted(mst.tree[2*nd], mst.tree[2*nd+1])
}

func mergeSorted(a, b []int) []int {
	r := make([]int, 0, len(a)+len(b))
	i, j := 0, 0
	for i < len(a) && j < len(b) {
		if a[i] <= b[j] { r = append(r, a[i]); i++ } else { r = append(r, b[j]); j++ }
	}
	r = append(r, a[i:]...); r = append(r, b[j:]...)
	return r
}

func (mst *MergeSortTree) countLeq(l, r, k int) int {
	return mst.query(1, 0, mst.n-1, l, r, k)
}

func (mst *MergeSortTree) query(nd, s, e, l, r, k int) int {
	if r < s || e < l { return 0 }
	if l <= s && e <= r { return sort.SearchInts(mst.tree[nd], k+1) }
	m := (s + e) / 2
	return mst.query(2*nd, s, m, l, r, k) + mst.query(2*nd+1, m+1, e, l, r, k)
}

func main() {
	var n int
	fmt.Scan(&n)
	arr := make([]int, n)
	for i := 0; i < n; i++ { fmt.Scan(&arr[i]) }
	mst := newMST(arr)
	var q int
	fmt.Scan(&q)
	for i := 0; i < q; i++ {
		var l, r, k int
		fmt.Scan(&l, &r, &k)
		if i > 0 { fmt.Print(" ") }
		fmt.Print(mst.countLeq(l, r, k))
	}
	fmt.Println()
}

func merge_sort_tree(n int, array []int, queries [][]int) []int {
	if len(array) == 0 || n == 0 {
		return make([]int, len(queries))
	}
	mst := newMST(array)
	results := make([]int, 0, len(queries))
	for _, query := range queries {
		if len(query) < 3 {
			results = append(results, 0)
			continue
		}
		results = append(results, mst.countLeq(query[0], query[1], query[2]))
	}
	return results
}
