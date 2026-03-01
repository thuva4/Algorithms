package maxflowmincut

// MaxFlowMinCut computes max flow using Edmonds-Karp (BFS-based Ford-Fulkerson).
func MaxFlowMinCut(arr []int) int {
	n, m, src, sink := arr[0], arr[1], arr[2], arr[3]
	cap := make([][]int, n)
	for i := range cap { cap[i] = make([]int, n) }
	for i := 0; i < m; i++ { cap[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i] }
	maxFlow := 0
	for {
		parent := make([]int, n)
		for i := range parent { parent[i] = -1 }
		parent[src] = src
		queue := []int{src}
		for len(queue) > 0 && parent[sink] == -1 {
			u := queue[0]; queue = queue[1:]
			for v := 0; v < n; v++ {
				if parent[v] == -1 && cap[u][v] > 0 { parent[v] = u; queue = append(queue, v) }
			}
		}
		if parent[sink] == -1 { break }
		flow := int(^uint(0) >> 1)
		for v := sink; v != src; v = parent[v] { if cap[parent[v]][v] < flow { flow = cap[parent[v]][v] } }
		for v := sink; v != src; v = parent[v] { cap[parent[v]][v] -= flow; cap[v][parent[v]] += flow }
		maxFlow += flow
	}
	return maxFlow
}
