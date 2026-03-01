package fordfulkerson

var capFF [][]int
var nFF int

func dfsFF(u, sink, flow int, visited []bool) int {
	if u == sink { return flow }
	visited[u] = true
	for v := 0; v < nFF; v++ {
		if !visited[v] && capFF[u][v] > 0 {
			f := flow
			if capFF[u][v] < f { f = capFF[u][v] }
			d := dfsFF(v, sink, f, visited)
			if d > 0 { capFF[u][v] -= d; capFF[v][u] += d; return d }
		}
	}
	return 0
}

// FordFulkerson computes max flow using DFS-based Ford-Fulkerson.
func FordFulkerson(arr []int) int {
	nFF = arr[0]; m := arr[1]; src := arr[2]; sink := arr[3]
	capFF = make([][]int, nFF)
	for i := range capFF { capFF[i] = make([]int, nFF) }
	for i := 0; i < m; i++ { capFF[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i] }
	maxFlow := 0
	for {
		visited := make([]bool, nFF)
		flow := dfsFF(src, sink, int(^uint(0)>>1), visited)
		if flow == 0 { break }
		maxFlow += flow
	}
	return maxFlow
}
