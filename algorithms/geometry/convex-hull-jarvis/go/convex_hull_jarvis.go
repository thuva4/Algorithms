package convexhulljarvis

func ConvexHullJarvis(arr []int) int {
	n := arr[0]
	if n < 2 {
		return n
	}

	px := make([]int, n)
	py := make([]int, n)
	for i := 0; i < n; i++ {
		px[i] = arr[1+2*i]
		py[i] = arr[1+2*i+1]
	}

	cross := func(o, a, b int) int {
		return (px[a]-px[o])*(py[b]-py[o]) - (py[a]-py[o])*(px[b]-px[o])
	}
	distSq := func(a, b int) int {
		return (px[a]-px[b])*(px[a]-px[b]) + (py[a]-py[b])*(py[a]-py[b])
	}

	start := 0
	for i := 1; i < n; i++ {
		if px[i] < px[start] || (px[i] == px[start] && py[i] < py[start]) {
			start = i
		}
	}

	hullCount := 0
	current := start
	for {
		hullCount++
		candidate := 0
		for i := 1; i < n; i++ {
			if i == current {
				continue
			}
			if candidate == current {
				candidate = i
				continue
			}
			c := cross(current, candidate, i)
			if c < 0 {
				candidate = i
			} else if c == 0 && distSq(current, i) > distSq(current, candidate) {
				candidate = i
			}
		}
		current = candidate
		if current == start {
			break
		}
	}

	return hullCount
}
