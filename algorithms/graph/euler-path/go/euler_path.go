package eulerpath

// EulerPath returns 1 if an Euler circuit exists in the undirected graph, 0 otherwise.
func EulerPath(arr []int) int {
	n, m := arr[0], arr[1]
	if n == 0 {
		return 1
	}
	adj := make([][]int, n)
	degree := make([]int, n)
	for i := 0; i < m; i++ {
		u, v := arr[2+2*i], arr[3+2*i]
		adj[u] = append(adj[u], v)
		adj[v] = append(adj[v], u)
		degree[u]++
		degree[v]++
	}
	for _, d := range degree {
		if d%2 != 0 {
			return 0
		}
	}
	start := -1
	for i := 0; i < n; i++ {
		if degree[i] > 0 {
			start = i
			break
		}
	}
	if start == -1 {
		return 1
	}
	visited := make([]bool, n)
	stack := []int{start}
	visited[start] = true
	for len(stack) > 0 {
		v := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		for _, u := range adj[v] {
			if !visited[u] {
				visited[u] = true
				stack = append(stack, u)
			}
		}
	}
	for i := 0; i < n; i++ {
		if degree[i] > 0 && !visited[i] {
			return 0
		}
	}
	return 1
}
