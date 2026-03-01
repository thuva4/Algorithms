package toposortkahn

// TopologicalSortKahn performs topological sort using Kahn's algorithm.
// Input: arr encodes [numVertices, numEdges, u1, v1, u2, v2, ...].
// Returns topological order, or empty slice if a cycle exists.
func TopologicalSortKahn(arr []int) []int {
	if len(arr) < 2 {
		return []int{}
	}

	numVertices := arr[0]
	numEdges := arr[1]

	adj := make([][]int, numVertices)
	for i := range adj {
		adj[i] = []int{}
	}
	inDegree := make([]int, numVertices)

	for i := 0; i < numEdges; i++ {
		u := arr[2+2*i]
		v := arr[2+2*i+1]
		adj[u] = append(adj[u], v)
		inDegree[v]++
	}

	queue := []int{}
	for v := 0; v < numVertices; v++ {
		if inDegree[v] == 0 {
			queue = append(queue, v)
		}
	}

	result := []int{}
	for len(queue) > 0 {
		u := queue[0]
		queue = queue[1:]
		result = append(result, u)
		for _, v := range adj[u] {
			inDegree[v]--
			if inDegree[v] == 0 {
				queue = append(queue, v)
			}
		}
	}

	if len(result) == numVertices {
		return result
	}
	return []int{}
}
