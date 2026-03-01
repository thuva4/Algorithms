package minimumcutstoerwagner

func MinimumCutStoerWagner(arr []int) int {
	n := arr[0]
	m := arr[1]
	w := make([][]int, n)
	for i := 0; i < n; i++ {
		w[i] = make([]int, n)
	}
	idx := 2
	for i := 0; i < m; i++ {
		u, v, c := arr[idx], arr[idx+1], arr[idx+2]
		w[u][v] += c
		w[v][u] += c
		idx += 3
	}

	merged := make([]bool, n)
	best := 1<<31 - 1

	for phase := 0; phase < n-1; phase++ {
		key := make([]int, n)
		inA := make([]bool, n)
		prev, last := -1, -1

		for it := 0; it < n-phase; it++ {
			sel := -1
			for v := 0; v < n; v++ {
				if !merged[v] && !inA[v] {
					if sel == -1 || key[v] > key[sel] {
						sel = v
					}
				}
			}
			inA[sel] = true
			prev = last
			last = sel
			for v := 0; v < n; v++ {
				if !merged[v] && !inA[v] {
					key[v] += w[sel][v]
				}
			}
		}

		if key[last] < best {
			best = key[last]
		}

		for v := 0; v < n; v++ {
			w[prev][v] += w[last][v]
			w[v][prev] += w[v][last]
		}
		merged[last] = true
	}

	return best
}
