package stronglyconnectedpathbased

func StronglyConnectedPathBased(arr []int) int {
	n := arr[0]; m := arr[1]
	adj := make([][]int, n)
	for i := 0; i < n; i++ { adj[i] = []int{} }
	for i := 0; i < m; i++ { adj[arr[2+2*i]] = append(adj[arr[2+2*i]], arr[2+2*i+1]) }

	preorder := make([]int, n)
	for i := range preorder { preorder[i] = -1 }
	counter := 0
	sStack := []int{}
	pStack := []int{}
	assigned := make([]bool, n)
	sccCount := 0

	var dfs func(v int)
	dfs = func(v int) {
		preorder[v] = counter; counter++
		sStack = append(sStack, v)
		pStack = append(pStack, v)

		for _, w := range adj[v] {
			if preorder[w] == -1 {
				dfs(w)
			} else if !assigned[w] {
				for len(pStack) > 0 && preorder[pStack[len(pStack)-1]] > preorder[w] {
					pStack = pStack[:len(pStack)-1]
				}
			}
		}

		if len(pStack) > 0 && pStack[len(pStack)-1] == v {
			pStack = pStack[:len(pStack)-1]
			sccCount++
			for {
				u := sStack[len(sStack)-1]
				sStack = sStack[:len(sStack)-1]
				assigned[u] = true
				if u == v { break }
			}
		}
	}

	for v := 0; v < n; v++ {
		if preorder[v] == -1 { dfs(v) }
	}
	return sccCount
}
