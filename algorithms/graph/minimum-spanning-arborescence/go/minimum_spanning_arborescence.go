package minimumspanningarborescence

import "math"

func MinimumSpanningArborescence(arr []int) int {
	n := arr[0]
	m := arr[1]
	root := arr[2]
	eu := make([]int, m)
	ev := make([]int, m)
	ew := make([]int, m)
	for i := 0; i < m; i++ {
		eu[i] = arr[3+3*i]
		ev[i] = arr[3+3*i+1]
		ew[i] = arr[3+3*i+2]
	}

	INF := math.MaxInt32 / 2
	res := 0

	for {
		minIn := make([]int, n)
		minEdge := make([]int, n)
		for i := 0; i < n; i++ {
			minIn[i] = INF
			minEdge[i] = -1
		}

		for i := 0; i < len(eu); i++ {
			if eu[i] != ev[i] && ev[i] != root && ew[i] < minIn[ev[i]] {
				minIn[ev[i]] = ew[i]
				minEdge[ev[i]] = eu[i]
			}
		}

		for i := 0; i < n; i++ {
			if i != root && minIn[i] == INF {
				return -1
			}
		}

		comp := make([]int, n)
		for i := range comp {
			comp[i] = -1
		}
		comp[root] = root
		numCycles := 0

		for i := 0; i < n; i++ {
			if i != root {
				res += minIn[i]
			}
		}

		visited := make([]int, n)
		for i := range visited {
			visited[i] = -1
		}

		for i := 0; i < n; i++ {
			if i == root {
				continue
			}
			v := i
			for visited[v] == -1 && comp[v] == -1 && v != root {
				visited[v] = i
				v = minEdge[v]
			}
			if v != root && comp[v] == -1 && visited[v] == i {
				u := v
				for {
					comp[u] = numCycles
					u = minEdge[u]
					if u == v {
						break
					}
				}
				numCycles++
			}
		}

		if numCycles == 0 {
			break
		}

		for i := 0; i < n; i++ {
			if comp[i] == -1 {
				comp[i] = numCycles
				numCycles++
			}
		}

		var neu, nev, newW []int
		for i := 0; i < len(eu); i++ {
			nu := comp[eu[i]]
			nv := comp[ev[i]]
			if nu != nv {
				neu = append(neu, nu)
				nev = append(nev, nv)
				newW = append(newW, ew[i]-minIn[ev[i]])
			}
		}

		eu = neu
		ev = nev
		ew = newW
		root = comp[root]
		n = numCycles
	}

	return res
}
