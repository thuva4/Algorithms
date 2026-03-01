package dinic

import (
	"math"
)

type Edge struct {
	to   int
	rev  int
	cap  int64
	flow int64
}

var adj [][]Edge
var level []int
var ptr []int

func Dinic(arr []int) int {
	if len(arr) < 4 {
		return 0
	}
	n := arr[0]
	m := arr[1]
	s := arr[2]
	t := arr[3]

	if len(arr) < 4+3*m {
		return 0
	}

	adj = make([][]Edge, n)
	for i := 0; i < m; i++ {
		u := arr[4+3*i]
		v := arr[4+3*i+1]
		cap := int64(arr[4+3*i+2])
		if u >= 0 && u < n && v >= 0 && v < n {
			addEdge(u, v, cap)
		}
	}

	level = make([]int, n)
	ptr = make([]int, n)

	var flow int64 = 0
	for bfs(s, t, n) {
		for i := range ptr {
			ptr[i] = 0
		}
		for {
			pushed := dfs(s, t, math.MaxInt64)
			if pushed == 0 {
				break
			}
			flow += pushed
		}
	}

	return int(flow)
}

func addEdge(u, v int, cap int64) {
	a := Edge{to: v, rev: len(adj[v]), cap: cap, flow: 0}
	b := Edge{to: u, rev: len(adj[u]), cap: 0, flow: 0} // Backward edge cap 0
	adj[u] = append(adj[u], a)
	adj[v] = append(adj[v], b)
}

func bfs(s, t, n int) bool {
	for i := range level {
		level[i] = -1
	}
	level[s] = 0
	q := []int{s}

	for len(q) > 0 {
		u := q[0]
		q = q[1:]
		for _, e := range adj[u] {
			if e.cap-e.flow > 0 && level[e.to] == -1 {
				level[e.to] = level[u] + 1
				q = append(q, e.to)
			}
		}
	}
	return level[t] != -1
}

func dfs(u, t int, pushed int64) int64 {
	if pushed == 0 {
		return 0
	}
	if u == t {
		return pushed
	}

	for ; ptr[u] < len(adj[u]); ptr[u]++ {
		cid := ptr[u]
		e := &adj[u][cid] // Pointer to modify flow
		v := e.to

		if level[u]+1 != level[v] || e.cap-e.flow == 0 {
			continue
		}

		tr := pushed
		if e.cap-e.flow < tr {
			tr = e.cap - e.flow
		}

		pushedFlow := dfs(v, t, tr)
		if pushedFlow == 0 {
			continue
		}

		e.flow += pushedFlow
		adj[v][e.rev].flow -= pushedFlow

		return pushedFlow
	}

	return 0
}
