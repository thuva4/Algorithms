package main

import "fmt"

type PNode struct {
	val         int64
	left, right int
}

var pnodes []PNode

func pNewNode(v int64, l, r int) int {
	pnodes = append(pnodes, PNode{v, l, r})
	return len(pnodes) - 1
}

func pBuild(a []int, s, e int) int {
	if s == e { return pNewNode(int64(a[s]), 0, 0) }
	m := (s + e) / 2
	l := pBuild(a, s, m); r := pBuild(a, m+1, e)
	return pNewNode(pnodes[l].val+pnodes[r].val, l, r)
}

func pUpdate(nd, s, e, idx, val int) int {
	if s == e { return pNewNode(int64(val), 0, 0) }
	m := (s + e) / 2
	if idx <= m {
		nl := pUpdate(pnodes[nd].left, s, m, idx, val)
		return pNewNode(pnodes[nl].val+pnodes[pnodes[nd].right].val, nl, pnodes[nd].right)
	}
	nr := pUpdate(pnodes[nd].right, m+1, e, idx, val)
	return pNewNode(pnodes[pnodes[nd].left].val+pnodes[nr].val, pnodes[nd].left, nr)
}

func pQuery(nd, s, e, l, r int) int64 {
	if r < s || e < l { return 0 }
	if l <= s && e <= r { return pnodes[nd].val }
	m := (s + e) / 2
	return pQuery(pnodes[nd].left, s, m, l, r) + pQuery(pnodes[nd].right, m+1, e, l, r)
}

func main() {
	var n int
	fmt.Scan(&n)
	a := make([]int, n)
	for i := 0; i < n; i++ { fmt.Scan(&a[i]) }
	pnodes = make([]PNode, 0, 4*n+200000)
	roots := []int{pBuild(a, 0, n-1)}
	var q int
	fmt.Scan(&q)
	first := true
	for i := 0; i < q; i++ {
		var t, a1, b1, c1 int
		fmt.Scan(&t, &a1, &b1, &c1)
		if t == 1 {
			roots = append(roots, pUpdate(roots[a1], 0, n-1, b1, c1))
		} else {
			if !first { fmt.Print(" ") }
			fmt.Print(pQuery(roots[a1], 0, n-1, b1, c1))
			first = false
		}
	}
	fmt.Println()
}

func persistent_segment_tree(n int, array []int, operations [][]int) []int {
	if n == 0 || len(array) == 0 {
		return []int{}
	}
	pnodes = make([]PNode, 0, 4*n+len(operations)*4+8)
	roots := []int{pBuild(array, 0, n-1)}
	results := make([]int, 0)
	for _, operation := range operations {
		if len(operation) < 4 {
			continue
		}
		if operation[0] == 1 {
			version := operation[1]
			if version < 0 || version >= len(roots) {
				continue
			}
			roots = append(roots, pUpdate(roots[version], 0, n-1, operation[2], operation[3]))
		} else if operation[0] == 2 {
			version := operation[1]
			if version < 0 || version >= len(roots) {
				results = append(results, 0)
				continue
			}
			results = append(results, int(pQuery(roots[version], 0, n-1, operation[2], operation[3])))
		}
	}
	return results
}
