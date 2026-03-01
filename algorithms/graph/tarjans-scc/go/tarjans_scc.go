package tarjansscc

func TarjansScc(arr []int) int {
	n := arr[0]
	m := arr[1]
	adj := make([][]int, n)
	for i := 0; i < n; i++ {
		adj[i] = []int{}
	}
	for i := 0; i < m; i++ {
		u := arr[2+2*i]
		v := arr[2+2*i+1]
		adj[u] = append(adj[u], v)
	}

	indexCounter := 0
	sccCount := 0
	disc := make([]int, n)
	low := make([]int, n)
	onStack := make([]bool, n)
	stack := []int{}
	for i := 0; i < n; i++ {
		disc[i] = -1
	}

	var strongconnect func(v int)
	strongconnect = func(v int) {
		disc[v] = indexCounter
		low[v] = indexCounter
		indexCounter++
		stack = append(stack, v)
		onStack[v] = true

		for _, w := range adj[v] {
			if disc[w] == -1 {
				strongconnect(w)
				if low[w] < low[v] {
					low[v] = low[w]
				}
			} else if onStack[w] {
				if disc[w] < low[v] {
					low[v] = disc[w]
				}
			}
		}

		if low[v] == disc[v] {
			sccCount++
			for {
				w := stack[len(stack)-1]
				stack = stack[:len(stack)-1]
				onStack[w] = false
				if w == v {
					break
				}
			}
		}
	}

	for v := 0; v < n; v++ {
		if disc[v] == -1 {
			strongconnect(v)
		}
	}

	return sccCount
}
