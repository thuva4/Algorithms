package main

import "fmt"

type SegTreeLazy struct {
	tree []int64
	lazy []int64
	n    int
}

func newSegTreeLazy(arr []int) *SegTreeLazy {
	n := len(arr)
	st := &SegTreeLazy{make([]int64, 4*n), make([]int64, 4*n), n}
	st.build(arr, 1, 0, n-1)
	return st
}

func (st *SegTreeLazy) build(a []int, nd, s, e int) {
	if s == e {
		st.tree[nd] = int64(a[s]); return
	}
	m := (s + e) / 2
	st.build(a, 2*nd, s, m); st.build(a, 2*nd+1, m+1, e)
	st.tree[nd] = st.tree[2*nd] + st.tree[2*nd+1]
}

func (st *SegTreeLazy) apply(nd, s, e int, v int64) {
	st.tree[nd] += v * int64(e-s+1); st.lazy[nd] += v
}

func (st *SegTreeLazy) pushDown(nd, s, e int) {
	if st.lazy[nd] != 0 {
		m := (s + e) / 2
		st.apply(2*nd, s, m, st.lazy[nd])
		st.apply(2*nd+1, m+1, e, st.lazy[nd])
		st.lazy[nd] = 0
	}
}

func (st *SegTreeLazy) update(l, r int, v int64) {
	st.doUpdate(1, 0, st.n-1, l, r, v)
}

func (st *SegTreeLazy) doUpdate(nd, s, e, l, r int, v int64) {
	if r < s || e < l { return }
	if l <= s && e <= r { st.apply(nd, s, e, v); return }
	st.pushDown(nd, s, e)
	m := (s + e) / 2
	st.doUpdate(2*nd, s, m, l, r, v)
	st.doUpdate(2*nd+1, m+1, e, l, r, v)
	st.tree[nd] = st.tree[2*nd] + st.tree[2*nd+1]
}

func (st *SegTreeLazy) query(l, r int) int64 {
	return st.doQuery(1, 0, st.n-1, l, r)
}

func (st *SegTreeLazy) doQuery(nd, s, e, l, r int) int64 {
	if r < s || e < l { return 0 }
	if l <= s && e <= r { return st.tree[nd] }
	st.pushDown(nd, s, e)
	m := (s + e) / 2
	return st.doQuery(2*nd, s, m, l, r) + st.doQuery(2*nd+1, m+1, e, l, r)
}

func main() {
	var n int
	fmt.Scan(&n)
	arr := make([]int, n)
	for i := 0; i < n; i++ { fmt.Scan(&arr[i]) }
	st := newSegTreeLazy(arr)
	var q int
	fmt.Scan(&q)
	first := true
	for i := 0; i < q; i++ {
		var t, l, r, v int
		fmt.Scan(&t, &l, &r, &v)
		if t == 1 {
			st.update(l, r, int64(v))
		} else {
			if !first { fmt.Print(" ") }
			fmt.Print(st.query(l, r))
			first = false
		}
	}
	fmt.Println()
}

func segment_tree_lazy(n int, array []int, operations [][]int) []int {
	if n == 0 || len(array) == 0 {
		return []int{}
	}
	st := newSegTreeLazy(array)
	results := make([]int, 0)
	for _, operation := range operations {
		if len(operation) < 4 {
			continue
		}
		if operation[0] == 1 {
			st.update(operation[1], operation[2], int64(operation[3]))
		} else if operation[0] == 2 {
			results = append(results, int(st.query(operation[1], operation[2])))
		}
	}
	return results
}
