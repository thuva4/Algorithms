package twosat

import (
	"math"
)

func TwoSat(arr []int) int {
	if len(arr) < 2 {
		return 0
	}
	n := arr[0]
	m := arr[1]

	if len(arr) < 2+2*m {
		return 0
	}

	numNodes := 2 * n
	adj := make([][]int, numNodes)
	for i := range adj {
		adj[i] = []int{}
	}

	for i := 0; i < m; i++ {
		uRaw := arr[2+2*i]
		vRaw := arr[2+2*i+1]

		u := (abs(uRaw)-1)*2
		if uRaw < 0 {
			u++
		}
		
		v := (abs(vRaw)-1)*2
		if vRaw < 0 {
			v++
		}

		notU := u ^ 1
		notV := v ^ 1

		adj[notU] = append(adj[notU], v)
		adj[notV] = append(adj[notV], u)
	}

	dfn := make([]int, numNodes)
	low := make([]int, numNodes)
	sccID := make([]int, numNodes)
	inStack := make([]bool, numNodes)
	stack := []int{}
	timer := 0
	sccCnt := 0

	var tarjan func(int)
	tarjan = func(u int) {
		timer++
		dfn[u] = timer
		low[u] = timer
		stack = append(stack, u)
		inStack[u] = true

		for _, v := range adj[u] {
			if dfn[v] == 0 {
				tarjan(v)
				if low[v] < low[u] {
					low[u] = low[v]
				}
			} else if inStack[v] {
				if dfn[v] < low[u] {
					low[u] = dfn[v]
				}
			}
		}

		if low[u] == dfn[u] {
			sccCnt++
			for {
				v := stack[len(stack)-1]
				stack = stack[:len(stack)-1]
				inStack[v] = false
				sccID[v] = sccCnt
				if u == v {
					break
				}
			}
		}
	}

	for i := 0; i < numNodes; i++ {
		if dfn[i] == 0 {
			tarjan(i)
		}
	}

	for i := 0; i < n; i++ {
		if sccID[2*i] == sccID[2*i+1] {
			return 0
		}
	}

	return 1
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
